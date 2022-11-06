var Add = document.querySelector(".addF");
var extra = document.querySelector(".extra-items");
var new_item = document.querySelector(".new-item");
Add.addEventListener("click", () => {
  var newElem = new_item.cloneNode(true);
  console.log(newElem);
  extra.appendChild(newElem);
});
