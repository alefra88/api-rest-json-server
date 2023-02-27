const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

const getAll = async () => {
  try {
    let res = await fetch("http://localhost:5555/planeswalkers"),
      json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    // console.log(json);
    json.forEach((el) => {
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
  } catch (err) {
    $table.insertAdjacentHTML(
      "afterend",
      `
    <div class="error-mes">
    <h2><b>Error ${err.status}: ${err}</b></h2>
    </div>
    `
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();
    if (!e.target.id.value) {
      //Create-POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              name: e.target.name.value,
              plane: e.target.plane.value,
              status: e.target.status.value,
              power: e.target.power.value,
              lastSeen: e.target.lastSeen.value,
            }),
          },
          res = await fetch("http://localhost:5555/planeswalkers", options),
          json = await res.json();
        location.reload();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
      } catch (err) {
        let message = err.statusText || "Ocurriò un error";
        $form.insertAdjacentHTML(
          "afterend",
          `
        <div class="error-mes">
        <h2><b>Error ${err.status}: ${message}</b></h2>
        </div>
        `
        );
      }
    } else {
      //update- PUT
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              name: e.target.name.value,
              plane: e.target.plane.value,
              status: e.target.status.value,
              power: e.target.power.value,
              lastSeen: e.target.lastSeen.value,
            }),
          },
          res = await fetch(
            `http://localhost:5555/planeswalkers/${e.target.id.value}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurriò un error";
        $form.insertAdjacentHTML(
          "afterend",
          `
        <div class="error-mes">
        <h2><b>Error ${err.status}: ${message}</b></h2>
        </div>
        `
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
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
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          res = await fetch(
            `http://localhost:5555/planeswalkers/${e.target.dataset.id}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        location.reload();
      } catch (error) {
        let message = err.statusText || "Ocurriò un error";
        $form.insertAdjacentHTML(
          "afterend",
          `
        <div class="error-mes">
        <h2><b>Error ${err.status}: ${message}</b></h2>
        </div>
        `
        );
      }
    }
  }
});
