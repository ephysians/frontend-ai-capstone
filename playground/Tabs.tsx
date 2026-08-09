import { useState, useRef, KeyboardEvent } from 'react';
import './playground.css';

/**
 * Tabs — built against the ARIA APG "Tabs" pattern (automatic activation):
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Required behavior implemented here:
 * - role="tablist" / role="tab" / role="tabpanel", correctly cross-referenced
 *   with aria-controls and aria-labelledby
 * - Roving tabindex: only the active tab is in the Tab order (tabIndex 0),
 *   the rest are tabIndex -1, so pressing Tab once lands you on the tablist,
 *   not once per tab
 * - Arrow Left/Right move between tabs and activate them immediately
 * - Home/End jump to the first/last tab
 * - aria-selected reflects the active tab
 */

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveId?: string;
}

export function Tabs({ tabs, defaultActiveId }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function activate(id: string) {
    setActiveId(id);
    tabRefs.current[id]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      activate(tabs[nextIndex].id);
    }
  }

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div>
      <div role="tablist" aria-label="Tabs" style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #363945' }}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => activate(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="pg-focusable"
              style={{
                padding: '0.5rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #6C7BFF' : '2px solid transparent',
                color: isActive ? '#E8EAED' : '#8B93A1',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          tabIndex={0}
          className="pg-focusable"
          style={{ padding: '1rem 0' }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
