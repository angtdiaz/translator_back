let translateFrom = document.querySelector("#translateFrom");
let translateTo = document.querySelector("#translateTo");

const options = {
  method: "get",
};
let source_language = "es";
let target_language = "en";
fetch("http://54.227.16.210:3000/languages", options)
  .then((res) => res.json())
  .then((objeto) => {
    let lenguages = objeto.data.languages;
    console.log();
    lenguages.forEach((element) => {
      translateFrom.innerHTML += `<option value = "${element.code}">${element.name}</option>`;
      translateTo.innerHTML += `<option value = "${element.code}">${element.name}</option>`;
    });

    translateFrom.addEventListener("click", () => {
      console.log(translateFrom.value);
      source_language = translateFrom.value;
    });

    translateTo.addEventListener("click", () => {
      console.log(translateTo.value);
      target_language = translateTo.value;
    });
  })
  .catch((err) => console.log(err));

let translate = document.querySelector("#translate");
let trasnlateTo = document.querySelector("#outputTranslate");

translate.addEventListener("click", () => {
  let inputTranslate = document.querySelector("#inputTranslate");
  let textToTranslate = inputTranslate.value;

  const encodedParams = new URLSearchParams();
  encodedParams.append("source_language", source_language);
  encodedParams.append("target_language", target_language);
  encodedParams.append("text", textToTranslate);

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: encodedParams,
  };

  fetch("http://54.227.16.210:3000/traslation", options)
    .then((response) => response.json())
    .then((response) => (trasnlateTo.value = response.data.translatedText))
    .catch((err) => console.error(err));
});
