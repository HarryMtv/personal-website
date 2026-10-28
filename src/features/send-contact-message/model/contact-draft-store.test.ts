import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useContactDraftStore } from './contact-draft-store';

describe('useContactDraftStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useContactDraftStore.setState({
      from: '',
      subject: '',
      topic: 'A role',
      message: '',
      botcheck: '',
    });
  });

  it('defaults to an empty draft with the first topic', () => {
    const { result } = renderHook(() => useContactDraftStore());
    expect(result.current.from).toBe('');
    expect(result.current.topic).toBe('A role');
  });

  it('sets fields and resets', () => {
    const { result } = renderHook(() => useContactDraftStore());
    act(() => result.current.setField('from', 'you@x.com'));
    act(() => result.current.setField('topic', 'Consulting'));
    act(() => result.current.setField('message', 'hello there'));
    expect(useContactDraftStore.getState().from).toBe('you@x.com');
    expect(useContactDraftStore.getState().topic).toBe('Consulting');

    act(() => result.current.reset());
    expect(useContactDraftStore.getState().from).toBe('');
    expect(useContactDraftStore.getState().topic).toBe('A role');
  });

  it('persists under the contact-draft key', () => {
    act(() => useContactDraftStore.getState().setField('from', 'persisted@x.com'));
    expect(sessionStorage.getItem('contact-draft')).toContain('persisted@x.com');
  });
});
