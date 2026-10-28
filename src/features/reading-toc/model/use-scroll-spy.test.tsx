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

    // The user scrolled (the observer reports b) after a TOC visit left #a.
    const callback = MockIntersectionObserver.callbacks[0];
    const observer = new MockIntersectionObserver(vi.fn());
    const instancesAfterMount = MockIntersectionObserver.instances.length;
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
});
