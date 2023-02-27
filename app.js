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
        $template.querySelector(".lastSeen").textContent = el.lastSeen;
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

d.addEventListener("submit", (e) => {
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      //CREATE-- POST
      ajax({
        url: "http://localhost:5555/planeswalkers",
        method: "POST",
        success: (res) => location.reload(),
        error: () =>
          $form.insertAdjacentHTML(
            "afterend",
            `
        <div class="error-mes">
        <h2><b>${err}</b></h2>
        </div>
        `
          ),
        data: {
          name: e.target.name.value,
          plane: e.target.plane.value,
          status: e.target.status.value,
          power: e.target.power.value,
          lastSeen: e.target.lastSeen.value,
        },
      });
    } else {
      ajax({
        url: `http://localhost:5555/planeswalkers/${e.target.id.value}`,
        method: "PUT",
        success: (res) => location.reload(),
        error: () =>
          $form.insertAdjacentHTML(
            "afterend",
            `
        <div class="error-mes">
        <h2><b>${err}</b></h2>
        </div>
        `
          ),
        data: {
          name: e.target.name.value,
          plane: e.target.plane.value,
          status: e.target.status.value,
          power: e.target.power.value,
          lastSeen: e.target.lastSeen.value,
        },
      });
    }
  }
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Planeswalker";
    $form.name.value = e.target.dataset.name;
    $form.plane.value = e.target.dataset.plane;
    $form.status.value = e.target.dataset.status;
    $form.power.value = e.target.dataset.power;
    $form.lastSeen.value = e.target.dataset.lastSeen;
    $form.id.value = e.target.dataset.id;
  }
  if (e.target.matches(".delete")) {
    let isDelete = confirm(`are your sure you wanna delete this object?`);
    if (isDelete) {
      //DELETE
      ajax({
        url: `http://localhost:5555/planeswalkers/${e.target.dataset.id}`,
        method: "DELETE",
        success: (res) => location.reload(),
        error: () => alert(err),
      });
    }
  }
});
