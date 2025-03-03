// Transcription.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import api from "../axios";
import logo from "../assets/Logo.png";
import bgImage from "../assets/BG_MainClient.png";

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
    // Ambil username dari data user yang login
    const username = localStorage.getItem("username") || "User"; // Pastikan ada cara mendapatkan username
    const currentDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Buat dokumen PDF dengan format A4
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Tambahkan background subtle
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, 210, 297, "F");

    // Header dengan logo dan informasi Polda DIY
    doc.setFillColor(35, 55, 96); // Warna biru tua untuk header
    doc.rect(0, 0, 210, 40, "F");

    // Logo Polda DIY
    // Asumsikan logo sudah diimpor, jika tidak, gunakan placeholder
    // Jika memungkinkan, ganti dengan logo resmi Polda DIY
    const imgWidth = 30;
    const imgHeight = 30;
    doc.addImage(logo, "PNG", 15, 5, imgWidth, imgHeight);

    // Judul institusi
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("KEPOLISIAN DAERAH ISTIMEWA YOGYAKARTA", 105, 15, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text("DIREKTORAT RESERSE KRIMINAL KHUSUS", 105, 22, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Jl. Lingkar Utara, Maguwoharjo, Depok, Sleman, Yogyakarta 55281",
      105,
      28,
      { align: "center" }
    );
    doc.text(
      "Telepon: (0274) 563494 | Email: reskrimsus@poldajogja.go.id",
      105,
      34,
      { align: "center" }
    );

    // Garis pemisah
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);

    // Judul laporan
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(35, 55, 96);
    doc.text("LAPORAN TRANSKRIPSI AUDIO", 105, 55, { align: "center" });

    // Informasi meta data file
    doc.setFillColor(242, 242, 247);
    doc.roundedRect(15, 60, 180, 30, 2, 2, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(35, 55, 96);
    doc.text("INFORMASI FILE", 20, 68);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const fileInfo = [
      `Nama File: ${fileName || "Tidak diketahui"}`,
      `Tanggal Rekaman: ${date || "Tidak diketahui"}`,
      `Tanggal Transkripsi: ${currentDate}`,
    ];

    let y = 75;
    fileInfo.forEach((info) => {
      doc.text(info, 20, y);
      y += 7;
    });

    // Judul transkripsi
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(35, 55, 96);
    doc.text("ISI TRANSKRIPSI", 20, 105);

    // Box untuk konten transkripsi
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(248, 248, 252);
    doc.roundedRect(15, 110, 180, 145, 2, 2, "FD");

    // Isi transkripsi
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);

    const startY = 118;
    const margin = 20;
    const maxWidth = 170;
    const lineHeight = 6;

    // Implementasi penanganan teks yang lebih baik
    const paragraphs = transcriptionText.split(/\n\s*\n/); // Split paragraphs

    y = startY;
    paragraphs.forEach((paragraph, idx) => {
      // Format paragraph dengan benar
      const lines = doc.splitTextToSize(paragraph, maxWidth);

      // Cek apakah perlu halaman baru
      if (y + lines.length * lineHeight > 250) {
        doc.addPage();

        // Header pada halaman baru
        doc.setFillColor(35, 55, 96);
        doc.rect(0, 0, 210, 20, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text("KEPOLISIAN DAERAH ISTIMEWA YOGYAKARTA", 105, 10, {
          align: "center",
        });
        doc.setFontSize(8);
        doc.text("LANJUTAN TRANSKRIPSI", 105, 16, { align: "center" });

        // Reset posisi untuk konten
        y = 30;
      }

      // Tambahkan paragraf
      lines.forEach((line) => {
        doc.text(line, margin, y);
        y += lineHeight;
      });

      // Tambahkan spasi antar paragraf
      if (idx < paragraphs.length - 1) {
        y += 4;
      }
    });

    // TTD dan informasi yang bertanggung jawab
    y = Math.min(y + 15, 260); // Pastikan TTD tidak terlalu jauh

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("Yogyakarta, " + currentDate, 140, y);

    y += 5;
    doc.text("Petugas Transkripsi,", 140, y);

    y += 20; // Beri ruang untuk TTD
    doc.setFont("helvetica", "bold");
    doc.text(username.toUpperCase(), 140, y); // Username sebagai penanda tangan

    // Tambahkan nomor dan kode dokumen di bawah
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const docNumber =
      "NO.DOK: " +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0") +
      "/" +
      new Date().getFullYear();
    doc.text(docNumber, 20, 280);

    // Footer
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);

      // Footer decoration line
      doc.setDrawColor(35, 55, 96);
      doc.setLineWidth(1);
      doc.line(15, 285, 195, 285);

      // Page number
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Halaman ${i} dari ${doc.internal.getNumberOfPages()}`,
        105,
        292,
        { align: "center" }
      );

      // Confidential text
      doc.setFontSize(7);
      doc.text("DOKUMEN RESMI POLDA DIY - RAHASIA", 20, 292);
    }

    // File name tanpa karakter khusus untuk nama file
    const sanitizedFileName = fileName
      ? fileName.replace(/[^a-zA-Z0-9]/g, "_")
      : "Rekaman_Audio";

    const outputFileName = `TRANSKRIP_POLDA_DIY_${sanitizedFileName}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    doc.save(outputFileName);
  };

  const handleUploadNew = () => {
    navigate("/app");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        const data = await response.json();
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="bg-black p-4 flex justify-between items-center">
        <img src={logo} alt="Dispatch Vox Logo" className="w-40 h-15" />
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          LOG OUT
        </button>
      </header>

      <div className="container mx-auto p-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Hasil Transkripsi
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {fileName || "File tidak diketahui"}
              </h2>
              <span className="text-white/80 text-sm">
                {date || "Tanggal tidak diketahui"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </button>
              <button
                onClick={handleUploadNew}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload File Baru
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 overflow-hidden">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-white text-lg">Memproses file audio...</p>
              <p className="text-white/70 text-sm mt-2">
                Mohon tunggu sebentar
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-400 text-lg">{error}</p>
              <button
                onClick={handleUploadNew}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Coba File Lain
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center bg-white/5 p-4 border-b border-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-white font-medium">Hasil Transkripsi</h3>
              </div>
              <div className="p-6 min-h-[400px] overflow-y-auto bg-gradient-to-b from-white/5 to-transparent">
                <p className="text-white whitespace-pre-wrap leading-relaxed">
                  {transcriptionText}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
