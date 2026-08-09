'use client';

import { useState, useRef } from 'react';
import { Modal } from '../../playground/Modal';
import { Tabs } from '../../playground/Tabs';
import { Disclosure } from '../../playground/Disclosure';

export default function PlaygroundPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display font-semibold text-2xl text-ink mb-2">Accessible component playground</h1>
      <p className="text-muted mb-10">
        Three hand-built components. Test with Tab, Shift+Tab, Escape, and Arrow keys, no mouse.
      </p>

      <section className="mb-12">
        <h2 className="font-display text-lg text-ink mb-4">Modal</h2>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setModalOpen(true)}
          className="font-mono text-sm bg-accent text-base font-medium px-4 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Open modal
        </button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} titleId="demo-modal-title" title="Example dialog">
          <p style={{ marginBottom: '1rem' }}>
            Focus is trapped here. Try Tab and Shift+Tab, it should cycle within this dialog. Escape closes it and
            returns focus to the button that opened it.
          </p>
          <button type="button" onClick={() => setModalOpen(false)} className="font-mono text-sm bg-accent text-base font-medium px-4 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            Close
          </button>
        </Modal>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-lg text-ink mb-4">Tabs</h2>
        <Tabs
          tabs={[
            { id: 'one', label: 'Problem', content: <p className="text-ink/90">Focus arrives on the tablist once, not once per tab.</p> },
            { id: 'two', label: 'Decision', content: <p className="text-ink/90">Arrow Left/Right move and activate immediately.</p> },
            { id: 'three', label: 'Outcome', content: <p className="text-ink/90">Home/End jump to the first/last tab.</p> },
          ]}
        />
      </section>

      <section>
        <h2 className="font-display text-lg text-ink mb-4">Disclosure</h2>
        <Disclosure summary="What did shadcn handle that I missed?">
          See NOTES.md in the repo root for the full comparison.
        </Disclosure>
      </section>
    </div>
  );
}
