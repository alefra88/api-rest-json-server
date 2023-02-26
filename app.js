const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const ajax = (options) => {
  let { url, method, success, error, data } = options;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      success(json);
    } else {
      let message = xhr.statusText || "Ocurriò un error";
      error(`Error${xhr.status}:${message}`);
    }
  });
  xhr.open(method || "GET", url);
  xhr.setRequestHeader("Content-type", "application/json;charset=utf-8");
  xhr.send(JSON.stringify(data));
};

const getAll = () => {
  ajax({
    method: "GET",
    url: "http://localhost:5555/planeswalkers",
    success: (res) => {
      console.log(res);
      res.forEach((el) => {
        $template.querySelector(".name").textContent = el.name;
        $template.querySelector(".plane").textContent = el.plane;
        $template.querySelector(".status").textContent = el.status;
        $template.querySelector(".power").textContent = el.power;
        $template.querySelector(".lastseen").textContent = el.lastSeen;
        $template.querySelector(".edit").dataset.id = el.id;
        $template.querySelector(".edit").dataset.name = el.name;
        $template.querySelector(".edit").dataset.plane = el.plane;
        $template.querySelector(".edit").dataset.status = el.status;
        $template.querySelector(".edit").dataset.power = el.power;
        $template.querySelector(".edit").dataset.lastSeen = el.lastSeen;
        $template.querySelector(".delete").dataset.id = el.id;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
      });
      $table.querySelector("tbody").appendChild($fragment);
    },
    error: (err) => {
      console.log(err);
      $table.insertAdjacentHTML(
        "afterend",
        `
      <div class="error-mes">
      <h2><b>${err}</b></h2>
      </div>
      `
      );
    },
  });
};

d.addEventListener("DOMContentLoaded", getAll);
