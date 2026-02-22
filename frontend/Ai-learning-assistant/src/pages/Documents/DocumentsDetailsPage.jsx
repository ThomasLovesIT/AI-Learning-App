import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";
import GenerateSummaryAndExplainConcept from '../../components/AiActions/GenerateSummmaryAndExplainConcept';
import FlashcardManager from '../../components/flashcards/FlashcardManager';


const DocumentsDetailsPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content"); // Capitalized to match tab name below

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error(error?.message || "Failed to fetch document data");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentData();
  }, [id]);

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    
    const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000")
    .replace(/\/api\/?$/, ""); // removes trailing /api or /api/
  return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (!document || !document.data || !document.data.filePath) {
      return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">
          Document not found
        </div>
      );
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <span className="text-sm font-medium text-gray-700">Document Viewer</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className="relative h-[800px] bg-gray-100">
          <iframe
            src={pdfUrl}
            title="Document Viewer"
            className="w-full h-full block"
            frameBorder="0"
            style={{
              colorScheme: "light",
            }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface/>
  };

  const renderAiActions = () => {
    return <GenerateSummaryAndExplainConcept/>
  };

  const renderFlashcardTab = () => {
    return <FlashcardManager documentId={id}/>
  };

  const renderQuizTab = () => {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">
        Quiz list coming soon
      </div>
    );
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "Ai Actions", label: "AI Actions", content: renderAiActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizTab() },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }
  if (!document) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">
        Document not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back To Documents
        </Link>
      </div>
      
      <PageHeader title={document.data.title || "Untitled Document"} />
      
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentsDetailsPage;