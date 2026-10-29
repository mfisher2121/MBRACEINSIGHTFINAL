(function () {
  const menu = document.getElementById("menu");
  const links = document.getElementById("navlinks");
  if (menu && links) {
    menu.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "CLOSE" : "MENU";
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.textContent = "MENU";
      });
    });
  }

  const progress = document.getElementById("progress");
  if (progress) {
    window.addEventListener("scroll", () => {
      const d = document.documentElement;
      const m = d.scrollHeight - d.clientHeight;
      progress.style.width = (m ? (d.scrollTop / m) * 100 : 0) + "%";
    });
  }

  document.querySelectorAll("form[data-mbrace-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".form-status");
      const thanks = form.getAttribute("data-thanks") || "/audit-thanks";
      const payload = new FormData(form);
      if (!payload.get("form-name")) {
        payload.set("form-name", form.getAttribute("name") || "lead");
      }

      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      const encoded = new URLSearchParams(payload).toString();
      const json = Object.fromEntries(payload.entries());

      try {
        const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

        const netlify = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encoded,
        }).catch(() => ({ ok: false, status: 0 }));

        await fetch("/api/form-to-n8n", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        }).catch(() => null);

        if (!netlify.ok && !isLocal) throw new Error("Form service returned " + netlify.status);
        window.location.href = thanks;
      } catch (error) {
        if (status) {
          status.className = "form-status err";
          status.textContent = "Could not send just now. Email hello@mbraceinsight.com and we’ll handle it manually.";
        }
        if (button) {
          button.disabled = false;
          button.textContent = button.getAttribute("data-label") || "Try again";
        }
      }
    });
  });
})();
