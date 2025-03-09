import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import api from "../axios";
import logo from "../assets/Logo.png";
import bgImage from "../assets/BG_MainClient.png";
import poldaLogo from "../assets/PoldaDIY.png";

const Transcription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName, transcription, date, label } = location.state || {};

  const [transcriptionText, setTranscriptionText] = useState(
    transcription || ""
  );
  const [transcriptionLabel, setTranscriptionLabel] = useState(label || "");
  const [isProcessing, setIsProcessing] = useState(!transcription);
  const [error, setError] = useState("");
  const [fileMetadata, setFileMetadata] = useState({
    name: fileName || "",
    date:
      date ||
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  });

  useEffect(() => {
    if (!transcription && fileName) {
      const fetchTranscription = async () => {
        setIsProcessing(true);
        setError("");
        try {
          const response = await fetch("http://localhost:8001/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName }),
          });
          const data = await response.json();

          if (response.ok && data.transcription) {
            setTranscriptionText(data.transcription);
            setTranscriptionLabel(data.label || "");

            // Update file metadata if available in response
            // PERUBAHAN: Gunakan original_filename jika tersedia
            if (data.original_filename || data.fileName) {
              setFileMetadata((prev) => ({
                ...prev,
                name: data.original_filename || data.fileName || prev.name,
              }));
            }
            // Kode untuk tanggal tetap sama
            if (data.date) {
              setFileMetadata((prev) => ({ ...prev, date: data.date }));
            } else {
              // If no date in response, use current date
              setFileMetadata((prev) => ({
                ...prev,
                date: new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              }));
            }
          } else {
            setError(data.message || "Transkripsi tidak ditemukan.");
          }
        } catch (error) {
          console.error("Error fetching transcription:", error);
          setError("Gagal mengambil transkripsi. Silakan coba lagi.");
        } finally {
          setIsProcessing(false);
        }
      };
      fetchTranscription();
    } else {
      // If we already have transcription, make sure we have date
      if (!date) {
        setFileMetadata((prev) => ({
          ...prev,
          date: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        }));
      }
    }
  }, [fileName, transcription, date]);

  const handleDownloadPDF = () => {
    // Create PDF with professional settings
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
  
    // ===== HEADER SECTION =====
    try {
      // Convert imported image to Data URL
      const convertImageToDataURL = (imgSrc, callback) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          callback(dataURL);
        };
        img.src = poldaLogo;
      };
  
      // Use the converted image
      convertImageToDataURL(poldaLogo, (logoDataURL) => {
        // Logo positioning - Slightly larger as requested
        const logoWidth = 25;
        const logoHeight = 25;
        doc.addImage(logoDataURL, "PNG", margin, 15, logoWidth, logoHeight);
  
        // Header text - Updated with slight right alignment
        // Menggeser header text sedikit ke kanan dari posisi tengah
        const headerOffset = 5; // Offset untuk menggeser ke kanan, bisa diubah sesuai kebutuhan
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        // Tambahkan offset ke posisi tengah untuk menggeser ke kanan
        doc.text("KEPOLISIAN NEGARA REPUBLIK INDONESIA", (pageWidth / 2) + headerOffset, 20, {
          align: "center",
        });
        doc.setFontSize(13);
        doc.text("DAERAH ISTIMEWA YOGYAKARTA", (pageWidth / 2) + headerOffset, 26, {
          align: "center",
        });
        doc.setFontSize(12);
        doc.text(
          "BIDANG TEKNOLOGI INFORMASI DAN KOMUNIKASI",
          (pageWidth / 2) + headerOffset,
          32,
          {
            align: "center",
          }
        );
        doc.setFontSize(11);
        doc.text("SUBBIDANG TEKINFO", (pageWidth / 2) + headerOffset, 37, {
          align: "center",
        });
  
        // Address line
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(
          "Jl. Lingkar Selatan, Tamantirto, Kasihan, Bantul, Yogyakarta 55183",
          (pageWidth / 2) + headerOffset,
          43,
          { align: "center" }
        );
  
        // Blue line under header
        doc.setDrawColor(0, 32, 96);
        doc.setLineWidth(0.7);
        doc.line(margin, 47, pageWidth - margin, 47);
  
        // Gold thin line
        doc.setDrawColor(218, 165, 32);
        doc.setLineWidth(0.3);
        doc.line(margin, 48.5, pageWidth - margin, 48.5);
  
        // Continue with the rest of the PDF generation
        generateRemainingPDF();
      });
  
      // Function to generate the rest of the PDF after logo is processed
      const generateRemainingPDF = () => {
        // ===== DOCUMENT TITLE =====
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("HASIL TRANSKRIPSI REKAMAN AUDIO", pageWidth / 2, 60, {
          align: "center",
        });
  
        // ===== DOCUMENT INFORMATION SECTION =====
        // Outline box untuk informasi dokumen
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(margin, 70, pageWidth - margin * 2, 30); // Document box dengan tinggi yang disesuaikan
  
        // Document information headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("INFORMASI DOKUMEN", margin + 2, 77);
  
        // Document details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
  
        const currentDate = new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  
        const displayFileName = fileMetadata.name || fileName || "File Audio";
        const displayDate = fileMetadata.date || date || currentDate;
        const fileID = `VOX-${Date.now()
          .toString()
          .substring(8, 13)}/${new Date().getFullYear()}`;
  
        // Left column
        doc.text("Nomor Berkas", margin + 5, 85);
        doc.text("Nama File", margin + 5, 92);
        doc.text("Tanggal Rekaman", margin + 5, 99);
  
        // Colon separator
        doc.text(":", margin + 40, 85);
        doc.text(":", margin + 40, 92);
        doc.text(":", margin + 40, 99);
  
        // Right column (values)
        doc.text(fileID, margin + 45, 85);
        doc.text(displayFileName, margin + 45, 92);
        doc.text(displayDate, margin + 45, 99);
  
        // ===== CLASSIFICATION SECTION (di bawah informasi dokumen dalam box terpisah) =====
        // Outline box untuk klasifikasi
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(margin, 110, pageWidth - margin * 2, 20); // Box klasifikasi di bawah informasi
  
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("KLASIFIKASI", margin + 2, 117);
        
        // Format yang sama dengan informasi dokumen
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Keterangan", margin + 5, 125);
        doc.text(":", margin + 40, 125);
        doc.text(
          transcriptionLabel || "Pertanyaan",
          margin + 45, 
          125
        );
  
        // ===== TRANSCRIPTION CONTENT =====
        // Transcription box
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(margin, 140, pageWidth - margin * 2, pageHeight - 205); // Box for transcription content
  
        // Judul ISI TRANSKRIPSI di dalam kotak
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("ISI TRANSKRIPSI:", margin + 2, 147);
  
        // Add transcription text inside the box
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
  
        const transcriptionContent =
          transcriptionText || "Tidak ada transkripsi tersedia.";
        const maxWidth = pageWidth - margin * 2 - 10; // Slightly smaller to add padding inside the box
        
        // Menggunakan perataan justify untuk teks transkripsi
        const splitText = doc.splitTextToSize(transcriptionContent, maxWidth);
        
        // Menerapkan alignment justify untuk teks transkripsi
        doc.text(splitText, margin + 5, 160, { 
          align: "justify",
          maxWidth: maxWidth 
        });
  
        // ===== FOOTER SECTION =====
        // Calculate footer position
        const footerY = pageHeight - 25;
  
        // Footer lines
        doc.setDrawColor(0, 32, 96);
        doc.setLineWidth(0.7);
        doc.line(margin, footerY, pageWidth - margin, footerY);
  
        doc.setDrawColor(218, 165, 32);
        doc.setLineWidth(0.3);
        doc.line(margin, footerY + 1.5, pageWidth - margin, footerY + 1.5);
  
        // Footer text
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.text(
          "Dokumen ini dihasilkan oleh sistem Dispatch Vox Polda DIY",
          pageWidth / 2,
          footerY + 7,
          {
            align: "center",
          }
        );
  
        // Left side: timestamp
        const timestamp = new Date()
          .toLocaleString("id-ID", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })
          .replace(/\./g, ":");
  
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Dicetak: ${timestamp}`, margin, footerY + 13);
  
        // Right side: page numbers
        doc.text(`Halaman 1 dari 1`, pageWidth - margin, footerY + 13, {
          align: "right",
        });
  
        // ===== SAVE PDF =====
        const safeName = displayFileName
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase();
        const dateStamp = new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        doc.save(`TRANSKRIPSI_POLDA_DIY_${safeName}_${dateStamp}.pdf`);
      };
    } catch (error) {
      console.error("Error adding header to PDF:", error);
  
      // If there's an error with the logo, still generate the PDF without it
      // Add basic fallback PDF generation here
      const safeName = (fileMetadata.name || fileName || "File_Audio")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      doc.save(`TRANSKRIPSI_POLDA_DIY_${safeName}_${dateStamp}.pdf`);
    }
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

  // Function to get classification badge color
  const getClassificationColor = (label) => {
    switch (label?.toLowerCase()) {
      case "aduan":
        return "bg-red-500";
      case "informasi":
        return "bg-blue-500";
      case "pertanyaan":
        return "bg-yellow-500";
      case "permintaan":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Display file name with fallback
  const displayFileName = fileMetadata.name || fileName || "File Audio";
  const displayDate = fileMetadata.date || date || "Hari ini";

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
                {displayFileName}
              </h2>
              <span className="text-white/80 text-sm">{displayDate}</span>
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
              <div className="flex items-center justify-between bg-white/5 p-4 border-b border-white/20">
                <div className="flex items-center">
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
                {transcriptionLabel && (
                  <div
                    className={`px-3 py-1 rounded text-white text-sm font-medium ${getClassificationColor(
                      transcriptionLabel
                    )}`}
                  >
                    {transcriptionLabel}
                  </div>
                )}
              </div>

              <div className="p-6 min-h-[400px] overflow-y-auto bg-gradient-to-b from-white/5 to-transparent">
                {/* Classification section */}
                {transcriptionLabel && (
                  <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white font-medium mb-2 flex items-center">
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Klasifikasi Audio:
                    </h4>
                    <div className="flex items-center">
                      <span
                        className={`px-4 py-2 rounded text-white font-medium ${getClassificationColor(
                          transcriptionLabel
                        )}`}
                      >
                        {transcriptionLabel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Transcription content */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center">
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Isi Transkripsi:
                  </h4>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                      {transcriptionText}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;
