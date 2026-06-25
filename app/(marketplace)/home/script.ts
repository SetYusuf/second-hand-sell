// DOM Elements
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const postBtn = document.getElementById("postBtn") as HTMLButtonElement;

// Search on Enter
searchInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const value = searchInput.value.trim();
    if (value.length > 0) {
      console.log("Searching for:", value);
      alert(`Searching for: ${value}`);
    }
  }
});

// Post button click
postBtn.addEventListener("click", () => {
  alert("Post button clicked!");
});
