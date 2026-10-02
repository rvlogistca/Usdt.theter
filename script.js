(function () {
  "use strict";

  const CONTRACT = "0x4644E1113FE1a6bA831D85cc4772b3D0c23DE655";
  const SYMBOL = "USTD";
  const DECIMALS = 18;
  const IMAGE = window.location.origin + window.location.pathname.replace(/[^/]*$/, "") + "ustd-icon.svg";

  // ===== Copy contract address =====
  const copyBtn = document.getElementById("copyBtn");
  const copyStatus = document.getElementById("copyStatus");
  const contractEl = document.getElementById("contractAddress");

  if (copyBtn && contractEl) {
    copyBtn.addEventListener("click", async () => {
      const address = contractEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(address);
        copyStatus.textContent = "Copiado!";
        setTimeout(() => {
          copyStatus.textContent = "";
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const range = document.createRange();
        range.selectNode(contractEl);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        copyStatus.textContent = "Copiado!";
        setTimeout(() => {
          copyStatus.textContent = "";
        }, 2000);
      }
    });
  }

  // ===== Add token to MetaMask / wallet =====
  const addWalletBtn = document.getElementById("addWalletBtn");
  const walletStatus = document.getElementById("walletStatus");

  function setStatus(msg, type) {
    if (!walletStatus) return;
    walletStatus.textContent = msg;
    walletStatus.className = "status " + (type || "");
  }

  if (addWalletBtn) {
    addWalletBtn.addEventListener("click", async () => {
      // Check if ethereum provider exists
      if (typeof window.ethereum === "undefined") {
        setStatus("Nenhuma carteira detectada. Instale MetaMask.", "error");
        return;
      }

      try {
        // Request account access first (optional but good UX)
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Add the token
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: CONTRACT,
              symbol: SYMBOL,
              decimals: DECIMALS,
              image: IMAGE
            }
          }
        });

        if (wasAdded) {
          setStatus("USTD adicionado à sua carteira!", "success");
        } else {
          setStatus("Adição cancelada pelo usuário.", "error");
        }
      } catch (err) {
        console.error(err);
        if (err.code === 4001) {
          setStatus("Solicitação rejeitada pelo usuário.", "error");
        } else {
          setStatus("Erro ao adicionar token. Tente novamente.", "error");
        }
      }
    });
  }
})();
