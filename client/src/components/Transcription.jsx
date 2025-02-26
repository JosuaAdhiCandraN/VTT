// Transcription.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import api from "../axios";

const Transcription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName, transcription, date } = location.state || {};

  const [transcriptionText, setTranscriptionText] = useState(
    transcription || ""
  );
  const [isProcessing, setIsProcessing] = useState(!transcription);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!transcription && fileName) {
      const fetchTranscription = async () => {
        try {
          const response = await api.get(
            `/api/audio/transcription?filePath=${encodeURIComponent(fileName)}`
          );
          if (response.data && response.data.transcription) {
            setTranscriptionText(response.data.transcription);
          } else {
            setError("Tidak ada hasil transkripsi yang ditemukan");
          }
        } catch (error) {
          console.error("Error fetching transcription:", error);
          setError(
            "Gagal mengambil transkripsi: " +
              (error.response?.data?.message || error.message)
          );
        } finally {
          setIsProcessing(false);
        }
      };
      fetchTranscription();
    }
  }, [fileName, transcription]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Set font dan judul
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Transkripsi Audio", 105, 20, { align: "center" });

    // Informasi file
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`File: ${fileName || "Tidak diketahui"}`, 10, 30);
    doc.text(`Tanggal: ${date || "Tidak diketahui"}`, 10, 40);

    // Garis pemisah
    doc.line(10, 45, 200, 45);

    // Transkripsi teks (multiline)
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    let y = 55; // Posisi awal teks
    const margin = 10;
    const maxWidth = 190;
    const lineHeight = 7;

    const textLines = doc.splitTextToSize(transcriptionText, maxWidth);
    textLines.forEach((line) => {
      if (y + lineHeight > 280) {
        doc.addPage(); // Tambah halaman kalau penuh
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    // Simpan file PDF
    doc.save(fileName ? `${fileName}.pdf` : "transcription.pdf");
  };

  const handleUploadNew = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-950 to-indigo-950">
      <header className="bg-black p-4 flex justify-between items-center">
        <span className="text-white font-bold text-xl">DISPATCH VOX</span>
        <button
          onClick={() => navigate("/login")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {fileName || "File tidak diketahui"}
            </h2>
            <span className="text-white/80">
              {date || "Tanggal tidak diketahui"}
            </span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download Transkripsi (PDF)
            </button>
            <button
              onClick={handleUploadNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload File Lain
            </button>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p className="text-white">Memproses file audio...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <div className="min-h-[400px] p-4 overflow-y-auto">
              <p className="text-white whitespace-pre-wrap">
                {transcriptionText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
