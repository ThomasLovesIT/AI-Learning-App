import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, UploadCloud, Loader2, Trash2, BookOpen, BrainCircuit } from "lucide-react";
import documentService from "../../services/documentService.js";

const DocumentsListPage = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const canUpload = useMemo(() => title.trim().length > 0 && !uploading, [title, uploading]);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getDocuments();
      setDocuments(res?.data ?? []);
    } catch (e) {
      toast.error(e?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const validatePdf = (file) => {
    if (!file) return "No file selected";
    const isPdf =
      file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) return "Please upload a PDF file";
    return null;
  };

  const uploadFile = async (file) => {
    const err = validatePdf(file);
    if (err) {
      toast.error(err);
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await documentService.uploadDocuments(formData);
      const doc = res?.data;
      toast.success("Uploaded! Processing started.");
      setTitle("");
      if (doc) setDocuments((prev) => [doc, ...prev]);
      fetchDocs();
    } catch (e) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onPickFile = () => fileInputRef.current?.click();

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const onDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    setDeleteConfirm(null);
    const prev = documents;
    setDocuments((d) => d.filter((x) => x._id !== id));
    try {
      await documentService.deleteDocument(id);
      toast.success("Document deleted");
    } catch (e) {
      setDocuments(prev);
      toast.error(e?.message || "Failed to delete document");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Documents
          </h1>
          <p className="mt-1 text-gray-600">
            Upload and manage your learning documents.
          </p>
        </div>
      </div>

      {/* Upload card */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Biology Chapter 3"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="mt-2 text-xs text-gray-500">
              Required by your backend during upload.
            </p>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF upload
            </label>
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={[
                "rounded-2xl border-2 border-dashed p-6 transition",
                isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50",
              ].join(" ")}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white ring-1 ring-gray-200 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-xs text-gray-600">
                      Or click to choose a file. PDF only.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onPickFile}
                  disabled={!canUpload}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Choose PDF"
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={onFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Your uploads</h2>
          <button
            type="button"
            onClick={fetchDocs}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center ring-1 ring-blue-100">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No documents yet
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Upload a PDF to generate flashcards, quizzes, summaries, and chat
                with AI.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0 flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center ring-1 ring-blue-100 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/documents/${doc._id}`}
                      className="text-base font-semibold text-gray-900 hover:text-blue-700 transition line-clamp-1"
                    >
                      {doc.title || "Untitled"}
                    </Link>
                    <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                      {doc.fileName}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* Status badge */}
                      <span
                        className={[
                          "text-xs font-medium px-2.5 py-1 rounded-full ring-1",
                          doc.status === "ready"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            : doc.status === "failed"
                              ? "bg-red-50 text-red-700 ring-red-100"
                              : "bg-amber-50 text-amber-700 ring-amber-100",
                        ].join(" ")}
                      >
                        {doc.status === "ready"
                          ? "✓ Ready"
                          : doc.status === "failed"
                            ? "✕ Failed"
                            : "⏳ Processing"}
                      </span>

                      {/* Flashcards count */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                        <BookOpen className="w-3 h-3" />
                        {doc.flashcardCount ?? 0} Flashcards
                      </span>

                      {/* Quizzes count */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 ring-1 ring-orange-100">
                        <BrainCircuit className="w-3 h-3" />
                        {doc.quizCount ?? 0} Quizzes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {deleteConfirm === doc._id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onDelete(doc._id)}
                        className="inline-flex items-center gap-1 rounded-xl text-white bg-red-600 hover:bg-red-700 transition text-xs px-3 py-1.5 font-medium"
                      >
                        <Trash2 className="w-3 h-3" />
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="rounded-xl text-gray-500 hover:bg-gray-100 transition text-xs px-3 py-1.5 font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDelete(doc._id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      aria-label="Delete document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsListPage;