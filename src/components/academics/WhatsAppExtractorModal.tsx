import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Check, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { parseWhatsAppMessage, ParsedWhatsAppEvent } from '../../utils/smartParser';
import { PlannerEvent } from '../../types';

interface WhatsAppExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvents: (events: Omit<PlannerEvent, 'id'>[]) => void;
}

const sampleChats = [
  {
    title: "CR Forward: OS & DBMS Submission Alert",
    text: `Attention CSE 3rd Year:
CR Note: Dr. Arvind Rao announced that Operating Systems Lab 4 files must be submitted this Friday by 4:00 PM in Software Lab 4.
Also, DBMS surprise quiz has been rescheduled to next Tuesday 11:00 AM.
Mandatory attendance for all.`
  },
  {
    title: "Robotics Club Orientation Clash",
    text: `Guys! Robotics Club Annual Hackathon orientation session will happen tomorrow at 3:00 PM in Mechanical Seminar Hall. All recruits must be present.`
  },
  {
    title: "Computer Networks Assignment 3",
    text: `Reminder: CN Assignment 3 (Subnetting numericals) submission link closes Thursday 11:59 PM. Strict zero marks for late submissions.`
  }
];

export const WhatsAppExtractorModal: React.FC<WhatsAppExtractorModalProps> = ({
  isOpen,
  onClose,
  onAddEvents
}) => {
  const [inputText, setInputText] = useState(sampleChats[0].text);
  const [extractedEvents, setExtractedEvents] = useState<ParsedWhatsAppEvent[]>([]);
  const [added, setAdded] = useState(false);

  const handleExtract = () => {
    const parsed = parseWhatsAppMessage(inputText);
    setExtractedEvents(parsed);
    setAdded(false);
  };

  const handleConfirmAdd = () => {
    const eventsToAdd: Omit<PlannerEvent, 'id'>[] = extractedEvents.map(e => ({
      title: e.title,
      type: e.type,
      subjectCode: e.subjectCode,
      date: e.date,
      startTime: e.startTime,
      endTime: e.endTime,
      priority: e.priority,
      source: 'whatsapp_extracted',
      notes: e.notes
    }));

    onAddEvents(eventsToAdd);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Forward & Notice Extractor"
      subtitle="Extract scattered CR forwards, lab deadlines, and quiz alerts into your schedule"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Sample clickers */}
        <div className="space-y-2">
          <label className="text-label uppercase tracking-wider text-ink-400 block">
            Try Sample WhatsApp Forwards:
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleChats.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sample.text);
                  setExtractedEvents([]);
                  setAdded(false);
                }}
                className="px-3 py-1.5 text-body-xs font-medium bg-base-100 hover:bg-accent-50 dark:bg-base-800 dark:hover:bg-accent-950/40 text-ink-700 dark:text-ink-200 hover:text-accent-700 dark:hover:text-accent-300 rounded-xl border border-ink-200/60 dark:border-ink-700/30 hover:border-accent-300/60 transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text input area */}
        <div>
          <textarea
            rows={4}
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              setExtractedEvents([]);
            }}
            placeholder="Paste raw forward from class WhatsApp group here..."
            className="w-full p-3.5 text-body-sm bg-base-100 dark:bg-base-800 border border-ink-200/60 dark:border-ink-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 text-ink-900 dark:text-ink-50 placeholder:text-ink-400 font-mono leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExtract}
            disabled={!inputText.trim()}
            className="btn-accent flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>Extract Structured Deadlines</span>
          </button>
        </div>

        {/* Extracted Preview List */}
        {extractedEvents.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-ink-200/60 dark:border-ink-700/30">
            <div className="flex items-center justify-between">
              <h4 className="text-label uppercase tracking-wider text-ink-400">
                Detected {extractedEvents.length} Item{extractedEvents.length > 1 ? 's' : ''}:
              </h4>
              <span className="badge-success">
                Auto-dated & priority ranked
              </span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {extractedEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-base-100 dark:bg-base-800/80 rounded-xl border border-ink-200/60 dark:border-ink-700/30 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sub-md text-ink-900 dark:text-ink-50">
                      {evt.title}
                    </span>
                    <span className="badge-accent">
                      {evt.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-body-xs text-ink-600 dark:text-ink-300">
                    <span className="flex items-center gap-1 font-semibold text-ink-800 dark:text-ink-100">
                      <Calendar className="w-3.5 h-3.5 text-accent-600 dark:text-accent-400" />
                      {evt.date}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-ink-400" />
                      {evt.startTime} - {evt.endTime}
                    </span>
                    {evt.detectedSubject && (
                      <span className="text-accent-700 dark:text-accent-300 font-medium">
                        {evt.detectedSubject} ({evt.subjectCode})
                      </span>
                    )}
                    <span className="badge-warning capitalize">
                      Priority: {evt.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="btn-accent flex items-center gap-1.5"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Planner!</span>
                  </>
                ) : (
                  <>
                    <span>Add All to My Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
