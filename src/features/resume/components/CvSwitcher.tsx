"use client";

import React, { useState, useRef, useEffect } from "react";
import { useResume } from "../resumeContext";
import { Icon, Button, Modal, Input } from "@/components/ui";
import { initialResumeData } from "../types";
import { sampleResumeData } from "../sampleData";

export const CvSwitcher: React.FC = () => {
  const { storage } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCvTitle, setNewCvTitle] = useState("");
  const [newCvType, setNewCvType] = useState<"sample" | "blank">("sample");

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState("");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newCvTitle.trim() || (newCvType === "sample" ? "Sample Developer CV" : "Untitled CV");
    const dataToUse = newCvType === "sample" ? sampleResumeData : initialResumeData;
    await storage.createCv(title, dataToUse);
    setIsCreateModalOpen(false);
    setNewCvTitle("");
    setIsOpen(false);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (renameTargetId && renameValue.trim()) {
      await storage.renameCv(renameTargetId, renameValue.trim());
      setIsRenameModalOpen(false);
      setRenameTargetId(null);
      setRenameValue("");
    }
  };

  const handleDeleteSubmit = async () => {
    if (deleteTargetId) {
      await storage.deleteCv(deleteTargetId);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  const isDb = storage.isDbMode;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 transition shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
        title={isDb ? "Manage saved CVs in SQLite Database" : "Manage saved CVs in LocalStorage"}
      >
        <span
          className={`flex items-center justify-center w-4 h-4 rounded ${
            isDb ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          <Icon name={isDb ? "database" : "layers"} size={11} />
        </span>
        <span className="font-medium max-w-[140px] truncate sm:max-w-[200px]">
          {storage.activeCvTitle || "Select CV"}
        </span>
        <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1 rounded border border-zinc-700">
          {storage.cvList.length}
        </span>
        <Icon
          name="chevron-down"
          size={12}
          className={`text-zinc-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 sm:w-80 rounded-lg bg-zinc-900 border border-zinc-750 shadow-2xl z-50 overflow-hidden text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-3 py-2 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <Icon
                name={isDb ? "database" : "layers"}
                size={13}
                className={isDb ? "text-indigo-400" : "text-emerald-400"}
              />
              <span>{isDb ? "Saved Resumes (SQLite DB)" : "Saved Resumes (LocalStorage)"}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
              {storage.cvList.length} total
            </span>
          </div>

          {/* CV List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 divide-y divide-zinc-800/50">
            {storage.cvList.map((cv) => {
              const isActive = cv.id === storage.activeCvId;
              const dateStr = new Date(cv.updated_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={cv.id}
                  className={`group flex items-center justify-between p-2 rounded-md transition ${
                    isActive
                      ? "bg-zinc-800/90 text-white font-medium ring-1 ring-zinc-600"
                      : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  {/* Select Resume Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isActive) {
                        storage.switchCv(cv.id);
                      }
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left flex items-start gap-2 min-w-0 pr-2 cursor-pointer"
                  >
                    <div className="pt-0.5 shrink-0">
                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ring-2 ring-emerald-400/30" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block group-hover:bg-zinc-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold leading-snug">
                        {cv.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {dateStr}
                      </div>
                    </div>
                  </button>

                  {/* Actions for this CV */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      title="Duplicate this CV"
                      onClick={(e) => {
                        e.stopPropagation();
                        storage.duplicateCv(cv.id);
                        setIsOpen(false);
                      }}
                      className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
                    >
                      <Icon name="copy" size={12} />
                    </button>
                    <button
                      type="button"
                      title="Rename this CV"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameTargetId(cv.id);
                        setRenameValue(cv.title);
                        setIsRenameModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
                    >
                      <Icon name="edit" size={12} />
                    </button>
                    {storage.cvList.length > 1 && (
                      <button
                        type="button"
                        title="Delete this CV"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTargetId(cv.id);
                          setDeleteTargetTitle(cv.title);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-red-950 hover:text-red-300 text-zinc-500 transition"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="p-2 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setNewCvTitle("");
                setNewCvType("sample");
                setIsCreateModalOpen(true);
              }}
              icon={<Icon name="plus" size={12} />}
              className="w-full text-xs py-1.5 h-8 justify-center"
            >
              New Resume Version
            </Button>
          </div>
        </div>
      )}

      {/* Create New CV Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Resume Version"
        description={
          isDb
            ? "Add another CV profile to your local SQLite database."
            : "Add another CV profile to your browser localStorage."
        }
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleCreateSubmit}
              icon={<Icon name="plus" size={12} />}
            >
              Create Resume
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <Input
            label="Resume Title / Role"
            placeholder="e.g. Senior Backend Engineer - Node.js"
            value={newCvTitle}
            onChange={(e) => setNewCvTitle(e.target.value)}
            autoFocus
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Initial Content Template</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNewCvType("sample")}
                className={`p-2.5 rounded-lg border text-left transition ${
                  newCvType === "sample"
                    ? "bg-zinc-800 border-zinc-500 text-white shadow-xs"
                    : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="font-semibold text-xs text-white">Full Demo Profile</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Pre-filled with senior developer experience and skills
                </div>
              </button>

              <button
                type="button"
                onClick={() => setNewCvType("blank")}
                className={`p-2.5 rounded-lg border text-left transition ${
                  newCvType === "blank"
                    ? "bg-zinc-800 border-zinc-500 text-white shadow-xs"
                    : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="font-semibold text-xs text-white">Blank Resume</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Start fresh with clean empty fields
                </div>
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Rename CV Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Resume"
        description="Update the identifier title for this CV."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleRenameSubmit}
              disabled={!renameValue.trim()}
            >
              Save Title
            </Button>
          </>
        }
      >
        <form onSubmit={handleRenameSubmit}>
          <Input
            label="Resume Title"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
          />
        </form>
      </Modal>

      {/* Delete CV Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Resume"
        description={`Are you sure you want to delete "${deleteTargetTitle}"? This cannot be undone.`}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDeleteSubmit}
            >
              Delete Resume
            </Button>
          </>
        }
      >
        <p className="text-xs text-zinc-400">
          The CV entry will be permanently removed. If this was your active CV, another saved CV will automatically become active.
        </p>
      </Modal>
    </div>
  );
};
