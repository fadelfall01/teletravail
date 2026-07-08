document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnEdit = document.getElementById('btn-edit');
  const btnPrint = document.getElementById('btn-print');
  const btnReset = document.getElementById('btn-reset');
  const themeDots = document.querySelectorAll('.theme-dot');
  const body = document.body;
  const editableElements = document.querySelectorAll('.editable');
  const avatarUpload = document.getElementById('avatar-upload');
  const profileImg = document.getElementById('profile-img');

  let isEditing = false;

  // --- Load Saved Data from LocalStorage ---
  const loadSavedData = () => {
    // Restore text content
    editableElements.forEach(el => {
      if (el.id) {
        const savedText = localStorage.getItem(`cv-data-${el.id}`);
        if (savedText !== null) {
          el.innerHTML = savedText;
        }
      }
    });

    // Restore Theme
    const savedTheme = localStorage.getItem('cv-theme');
    if (savedTheme) {
      body.className = '';
      body.classList.add(`theme-${savedTheme}`);
      themeDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === savedTheme);
      });
    }

    // Restore Avatar
    const savedAvatar = localStorage.getItem('cv-avatar');
    if (savedAvatar) {
      profileImg.src = savedAvatar;
    }
  };

  // --- Save All Data to LocalStorage ---
  const saveAllData = () => {
    editableElements.forEach(el => {
      if (el.id) {
        localStorage.setItem(`cv-data-${el.id}`, el.innerHTML);
      }
    });
  };

  // --- Toggle Edit Mode ---
  const toggleEditMode = () => {
    isEditing = !isEditing;
    
    if (isEditing) {
      body.classList.add('is-editing');
      editableElements.forEach(el => {
        el.contentEditable = 'true';
      });
      btnEdit.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        <span>Sauvegarder</span>
      `;
      btnEdit.classList.remove('btn-secondary');
      btnEdit.classList.add('btn-primary');
    } else {
      body.classList.remove('is-editing');
      editableElements.forEach(el => {
        el.contentEditable = 'false';
      });
      btnEdit.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        <span>Activer l'édition</span>
      `;
      btnEdit.classList.remove('btn-primary');
      btnEdit.classList.add('btn-secondary');
      
      // Save changes
      saveAllData();
      showTemporaryToast('Modifications enregistrées localement !');
    }
  };

  // --- Theme Selection ---
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.dataset.theme;
      
      // Update UI active state
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Update Body Theme
      body.className = '';
      body.classList.add(`theme-${theme}`);
      
      // If we are currently editing, keep the edit class active
      if (isEditing) {
        body.classList.add('is-editing');
      }

      // Save theme selection
      localStorage.setItem('cv-theme', theme);
    });
  });

  // --- Avatar Image Upload ---
  avatarUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit base64 storage to ~2.5MB to stay within 5MB localStorage limit)
      if (file.size > 2.5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse (max: 2.5 Mo pour la sauvegarde en cache).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        profileImg.src = base64Image;
        try {
          localStorage.setItem('cv-avatar', base64Image);
        } catch (error) {
          console.warn('Impossible de sauvegarder la photo dans localStorage (quota dépassé). Elle restera visible jusqu\'au rechargement.', error);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // --- Reset All Data ---
  const resetAllData = () => {
    if (confirm('Voulez-vous vraiment réinitialiser le CV et restaurer les données d\'origine ? Vos modifications seront perdues.')) {
      // Clear localStorage items prefixing our keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cv-data-') || key === 'cv-theme' || key === 'cv-avatar') {
          localStorage.removeItem(key);
        }
      });
      // Reload page to restore defaults
      window.location.reload();
    }
  };

  // --- Helper Toast/Notification ---
  const showTemporaryToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'no-print';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#1e293b';
    toast.style.color = '#ffffff';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    toast.style.fontSize = '12.5px';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.transform = 'translateY(10px)';
    toast.style.opacity = '0';
    
    toast.innerText = message;
    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  // --- Event Listeners ---
  btnEdit.addEventListener('click', toggleEditMode);
  btnPrint.addEventListener('click', () => {
    // If user is editing, disable edit mode to save changes and look clean before printing
    if (isEditing) {
      toggleEditMode();
    }
    // Small delay to ensure state transitions complete visually
    setTimeout(() => {
      window.print();
    }, 200);
  });
  btnReset.addEventListener('click', resetAllData);

  // Initialize
  loadSavedData();
});
