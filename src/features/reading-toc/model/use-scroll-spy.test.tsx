import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useScrollSpy } from './use-scroll-spy';

type ObserverCallback = IntersectionObserverCallback;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: readonly number[] = [];
  static callbacks: ObserverCallback[] = [];
  static instances: MockIntersectionObserver[] = [];
  observed: Element[] = [];
  constructor(callback: ObserverCallback) {
    MockIntersectionObserver.callbacks.push(callback);
    MockIntersectionObserver.instances.push(this);
  }
  observe = vi.fn((element: Element) => {
    this.observed.push(element);
  });
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
}

function entry(id: string, isIntersecting: boolean): IntersectionObserverEntry {
  return {
    target: document.getElementById(id)!,
    isIntersecting,
    boundingClientRect: {} as DOMRect,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRect,
    rootBounds: null,
    time: 0,
  };
}

function Probe({ ids }: { ids: string[] }) {
  const active = useScrollSpy(ids);
  return (
    <div>
      <span data-testid="active">{active ?? 'none'}</span>
      {ids.map((id) => (
        <section key={id} id={id} />
      ))}
    </div>
  );
}

/** Simulates scroll geometry; returns a restore function. */
function stubScrollGeometry({
  innerHeight,
  scrollY,
  scrollHeight,
}: {
  innerHeight: number;
  scrollY: number;
  scrollHeight: number;
}) {
  const originals = [
    { target: window, key: 'innerHeight' },
    { target: window, key: 'scrollY' },
    { target: document.documentElement, key: 'scrollHeight' },
  ].map(({ target, key }) => ({
    target,
    key,
    descriptor: Object.getOwnPropertyDescriptor(target, key),
  }));
  Object.defineProperty(window, 'innerHeight', { configurable: true, get: () => innerHeight });
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollY });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
  return () => {
    for (const { target, key, descriptor } of originals) {
      // Inherited getters have no own descriptor — deleting our shadow
      // restores them.
      if (descriptor) Object.defineProperty(target, key, descriptor);
      else Reflect.deleteProperty(target, key);
    }
  };
}

describe('useScrollSpy', () => {
  it('starts on the first id', () => {
    const { getByTestId } = render(<Probe ids={['a', 'b']} />);
    expect(getByTestId('active')).toHaveTextContent('a');
  });

  it('follows the section entering the viewport', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    MockIntersectionObserver.callbacks = [];
    MockIntersectionObserver.instances = [];
    const { getByTestId } = render(<Probe ids={['a', 'b']} />);

    const callback = MockIntersectionObserver.callbacks[0];
    const observer = new MockIntersectionObserver(vi.fn());
    act(() => {
      callback([entry('b', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('b');

    act(() => {
      callback([entry('a', true), entry('b', false)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('a');
    vi.unstubAllGlobals();
  });

  it('returns none when ids is empty and updates on hashchange', () => {
    const { getByTestId, rerender } = render(<Probe ids={[]} />);
    expect(getByTestId('active')).toHaveTextContent('none');

    rerender(<Probe ids={['a', 'b']} />);
    window.location.hash = '#b';
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(getByTestId('active')).toHaveTextContent('b');
    window.location.hash = '';
  });

  it('keeps the scrolled section when re-rendered with a new but equal ids array', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    MockIntersectionObserver.callbacks = [];
    MockIntersectionObserver.instances = [];
    window.location.hash = '#a';
    const { getByTestId, rerender } = render(<Probe ids={['a', 'b']} />);

    const callback = MockIntersectionObserver.callbacks[0];
    const observer = new MockIntersectionObserver(vi.fn());
    const instancesAfterMount = MockIntersectionObserver.instances.length;
    // The TOC visit left #a; the user then scrolls (wheel) and the observer
    // reports b.
    act(() => {
      window.dispatchEvent(new WheelEvent('wheel'));
    });
    act(() => {
      callback([entry('b', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('b');

    // A re-render hands the hook a fresh array with the same ids; the
    // highlight must stay on b and the observer must not be re-created.
    rerender(<Probe ids={['a', 'b'].slice()} />);
    expect(getByTestId('active')).toHaveTextContent('b');
    expect(MockIntersectionObserver.instances).toHaveLength(instancesAfterMount);

    window.location.hash = '';
    vi.unstubAllGlobals();
  });

  it('keeps a hash-pinned section until the user scrolls', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    MockIntersectionObserver.callbacks = [];
    MockIntersectionObserver.instances = [];
    window.location.hash = '#b';
    const { getByTestId } = render(<Probe ids={['a', 'b']} />);

    const callback = MockIntersectionObserver.callbacks[0];
    const observer = new MockIntersectionObserver(vi.fn());
    // The anchor jump lands at the document bottom, so an earlier heading
    // intersects the top zone on the next frame — the pin must hold.
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('b');

    // The reader's own scroll lifts the pin; the observer wins again.
    act(() => {
      window.dispatchEvent(new WheelEvent('wheel'));
    });
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('a');

    window.location.hash = '';
    vi.unstubAllGlobals();
  });

  it('lifts the hash pin on touchmove and paging keys, but not on non-paging keys', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    MockIntersectionObserver.callbacks = [];
    MockIntersectionObserver.instances = [];
    window.location.hash = '#b';
    const { getByTestId } = render(<Probe ids={['a', 'b']} />);

    const callback = MockIntersectionObserver.callbacks[0];
    const observer = new MockIntersectionObserver(vi.fn());

    // Non-scroll keys (like Escape or Tab) do not clear the pin.
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('b');

    // A paging key lifts the pin.
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }));
    });
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('a');

    // Re-pin via hashchange, then lift via touchmove.
    window.location.hash = '#b';
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(getByTestId('active')).toHaveTextContent('b');
    act(() => {
      window.dispatchEvent(new Event('touchmove'));
    });
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('a');

    window.location.hash = '';
    vi.unstubAllGlobals();
  });

  it('activates the last section at the bottom of the page, but not on a non-scrollable page', () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    MockIntersectionObserver.callbacks = [];
    MockIntersectionObserver.instances = [];
    const restoreScrollable = stubScrollGeometry({
      innerHeight: 800,
      scrollY: 1200,
      scrollHeight: 2000,
    });
    const { getByTestId } = render(<Probe ids={['a', 'b']} />);

    // Earlier headings fill the top zone at the bottom of a long page, but
    // the last section can never reach it — it must win there.
    const callback = MockIntersectionObserver.callbacks[0];
    const observer = new MockIntersectionObserver(vi.fn());
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('b');
    restoreScrollable();

    // On a short page that cannot scroll (scrollHeight <= innerHeight), the
    // intersecting top section wins instead of forcing the last section.
    const restoreShort = stubScrollGeometry({ innerHeight: 800, scrollY: 0, scrollHeight: 800 });
    act(() => {
      callback([entry('a', true)], observer);
    });
    expect(getByTestId('active')).toHaveTextContent('a');

    restoreShort();
    window.location.hash = '';
    vi.unstubAllGlobals();
  });
});
