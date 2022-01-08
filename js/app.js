const input = document.querySelector(".block__search");
const option = document.querySelector(".block__option");
const inputResults = document.querySelector(".block__elements-search");
const githubAPI = "https://api.github.com";
const list = new Map();

const createSearchBlock = (repoName) => {
  const container = document.querySelector(".block__elements-search");
  const searchOption = document.createElement("div");
  searchOption.classList.add("block__option");
  searchOption.textContent = repoName;
  container.appendChild(searchOption);
};

const createAddedBlock = ([name, owner, stars] = info) => {
  const block = document.querySelector(".block__elements-result");
  const blockWithResult = `<div class = 'block__added'><div class = 'block__added--info'><h4 class = 'block__added--text'>Name: ${name}</h4><h4 class = 'block__added--text'>Owner: ${owner}</h4><h4 class = 'block__added--text'>Stars: ${stars}</h4></div><button class = 'block__added--delete'>X</button></div>`;
  block.innerHTML = blockWithResult;
  const btn = document.querySelector(".block__added--delete");
  function removeBlock() {
    block.innerHTML = "";
    btn.removeEventListener("click", removeBlock);
  }
  btn.addEventListener("click", removeBlock);

  // const blockWithResult = document.createElement("div");
  // blockWithResult.classList.add("block__added");
  // const infoBlock = document.createElement("div");
  // infoBlock.classList.add("block__added--info");
  // const nameInfo = document.createElement("h4");
  // const ownerInfo = document.createElement("h4");
  // const starsInfo = document.createElement("h4");
  // nameInfo.classList.add("block__added--text");
  // ownerInfo.classList.add("block__added--text");
  // starsInfo.classList.add("block__added--text");
  // nameInfo.textContent = `Name: ${name}`;
  // ownerInfo.textContent = `Owner: ${owner}`;
  // starsInfo.textContent = `Stars: ${stars}`;
  // const btn = document.createElement("button");
  // btn.classList.add("block__added--delete");
  // btn.textContent = "X";
  // infoBlock.append(nameInfo);
  // infoBlock.append(ownerInfo);
  // infoBlock.append(starsInfo);
  // blockWithResult.append(infoBlock);
  // blockWithResult.append(btn);
  // block.append(blockWithResult);
};

const removeList = () => {
  const elements = document.querySelectorAll(".block__option");
  elements.forEach((element) => element.remove());
};

const getRepos = async (repoName) => {
  const url = `${githubAPI}/search/repositories?q=${repoName}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    throw new Error(`Empty input or something else. DEBUG: ${error}`);
  }
};

const getListFromInput = async () => {
  const results = await getRepos(input.value);
  if (option == null) {
    removeList();
  }
  for (let i = 0; i < 5; i++) {
    list.set(results.items[i]["name"], [
      results.items[i]["name"],
      results.items[i]["owner"]["login"],
      results.items[i]["stargazers_count"],
    ]);
    createSearchBlock(results.items[i]["name"]);
  }
};

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

input.addEventListener("input", debounce(getListFromInput, 500));

inputResults.addEventListener("click", (event) => {
  let target = event.target;
  target.classList.add("block__option--active");
  const name = target.textContent;
  createAddedBlock(list.get(name));
  input.value = "";
  removeList();
});
