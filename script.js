document.addEventListener('DOMContentLoaded', () => {
  const btnPrint = document.getElementById('btn-print');
  
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      const element = document.getElementById('cv-content');
      
      // Options pour la génération du PDF
      const opt = {
        margin:       0,
        filename:     'CV_Mouhamadou_Fadel_Fall.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 3,            // High resolution rendering for sharp text
          useCORS: true,        // Allow loading external image assets if any
          letterRendering: true
        },
        jsPDF:        { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      // Show download animation or loading state
      const originalText = btnPrint.innerHTML;
      btnPrint.disabled = true;
      btnPrint.innerHTML = `
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        <span>Génération...</span>
      `;
      
      // Generate and download PDF
      html2pdf().set(opt).from(element).save()
        .then(() => {
          // Restore button state
          btnPrint.disabled = false;
          btnPrint.innerHTML = originalText;
        })
        .catch((err) => {
          console.error("Erreur lors du téléchargement du PDF :", err);
          btnPrint.disabled = false;
          btnPrint.innerHTML = originalText;
          alert("Une erreur s'est produite lors de la génération du PDF. Tentative via l'impression classique.");
          window.print();
        });
    });
  }
});
