function GetPanelName() {
  const Path = window.location.pathname;
  const Match = Path.match(/\/Panels\/(\w+)\.html$/i);
  return Match ? Match[1].toLowerCase() : null;
}

function RenderAbout(Data) {
  let Html = `<p>${Data.description}</p>`;
  return Html;
}

function RenderProjects(Data) {
  if (!Data.content || !Array.isArray(Data.content))
    return "<p>No projects found.</p>";
  let Html = "<ul>";
  Data.content.forEach((Item) => {
    Html += `<li>
      <strong>${Item.name}</strong><br>
      ${Item.description}<br>`;
    if (Item.link) {
      if (typeof Item.link === "string") {
        Html += `<a href="${Item.link}" class="menu-item" target="_blank" rel="noopener">View</a>`;
      } else {
        Html += `<a href="${
          Item.link.url
        }" class="menu-item" target="_blank" rel="noopener">${
          Item.link.label || "View"
        }</a>`;
      }
    }
    Html += `</li>`;
  });
  Html += "</ul>";
  return Html;
}

function RenderLogs(Data) {
  if (!Data.entries || !Array.isArray(Data.entries))
    return "<p>No logs found.</p>";
  let Html = "<ul>";
  Data.entries.forEach((Entry) => {
    Html += `<li><strong>${Entry.date}</strong> ${Entry.description}</li>`;
  });
  Html += "</ul>";
  return Html;
}

function RenderVault(Data) {
  if (!Data.items || !Array.isArray(Data.items))
    return "<p>No vault items found.</p>";
  let Html = "<ul>";
  Data.items.forEach((Item) => {
    Html += `<li><strong>${Item.name}</strong> ${Item.description || ""}`;
    if (Item.link) {
      Html += `<br><a href="${
        Item.link.url
      }" class="menu-item" target="_blank" rel="noopener" id="button-view">${
        Item.link.label || "View"
      }</a>`;
    }
    Html += `</li>`;
  });
  Html += "</ul>";
  return Html;
}

document.addEventListener("DOMContentLoaded", () => {
  const Panel = GetPanelName();
  if (!Panel) return;

  fetch("../Content/Panels.json")
    .then((Res) => (Res.ok ? Res.json() : Promise.reject()))
    .then((Data) => {
      const PanelContent = document.getElementById("panel-content");
      if (!PanelContent || !Data[Panel]) return;

      let Html = "";
      if (Panel === "about") Html = RenderAbout(Data.about);
      else if (Panel === "projects") Html = RenderProjects(Data.projects);
      else if (Panel === "logs") Html = RenderLogs(Data.logs);
      else if (Panel === "vault") Html = RenderVault(Data.vault);
      else Html = "<p>Panel not found.</p>";

      PanelContent.innerHTML = Html;
    })
    .catch(() => {
      console.error("Failed to load Panels.json");
    });
});
