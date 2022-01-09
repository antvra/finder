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
  const blockWithResult = document.createElement("div");
  blockWithResult.classList.add("block__added");
  const infoBlock = document.createElement("div");
  infoBlock.classList.add("block__added--info");
  const nameInfo = document.createElement("h4");
  const ownerInfo = document.createElement("h4");
  const starsInfo = document.createElement("h4");
  nameInfo.classList.add("block__added--text");
  ownerInfo.classList.add("block__added--text");
  starsInfo.classList.add("block__added--text");
  nameInfo.textContent = `Name: ${name}`;
  ownerInfo.textContent = `Owner: ${owner}`;
  starsInfo.textContent = `Stars: ${stars}`;
  const btn = document.createElement("button");
  btn.classList.add("block__added--delete");
  btn.textContent = "X";
  infoBlock.append(nameInfo);
  infoBlock.append(ownerInfo);
  infoBlock.append(starsInfo);
  blockWithResult.append(infoBlock);
  blockWithResult.append(btn);
  block.append(blockWithResult);
  const removeBlock = () => {
    btn.removeEventListener("click", removeBlock);
    blockWithResult.remove();
  };
  btn.addEventListener("click", removeBlock);
};

const removeList = () => {
  const elements = document.querySelectorAll(".block__option");
  elements.forEach((element) => element.remove());
};

const getRepos = async (repoName) => {
  const url = `${githubAPI}/search/repositories?q=${repoName}&per_page=5`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    throw new Error(`Empty input or something else. DEBUG: ${error}`);
  }
};

const getListFromInput = async () => {
  const results = await getRepos(input.value);
  inputResults.addEventListener("click", clickOnList);
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

const clickOnList = (event) => {
  let target = event.target;
  target.classList.add("block__option--active");
  const name = target.textContent;
  createAddedBlock(list.get(name));
  input.value = "";
  removeList();
  inputResults.removeEventListener("click", clickOnList);
};

input.addEventListener("input", debounce(getListFromInput, 500));
