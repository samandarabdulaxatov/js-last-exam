const elPostsTemplate = document.querySelector(".posts__item-template").content;
const elUsersTemplate = document.querySelector(".users__item-template").content;
const elCommentsTemplate = document.querySelector(
  ".comments__item-template"
).content;

const elUsersList = document.querySelector(".users__list");
const elPostsList = document.querySelector(".posts__list");
const elCommentsList = document.querySelector(".comments__list");
const usersListItem = document.querySelector(".users__item");

function renderUsers(users, element) {
  const usersFragment = document.createDocumentFragment();

  users.forEach((user) => {
    const usersTemplate = elUsersTemplate.cloneNode(true);
    usersTemplate.querySelector(".users__item").dataset.user_id = user.id;
    usersTemplate.querySelector(".user__id").textContent = user.id;
    usersTemplate.querySelector(".user__name").textContent = user.name;
    usersTemplate.querySelector(".user__user-name").textContent = user.username;
    usersTemplate.querySelector(".user__email").textContent = user.email;
    const elUserAddress = elUsersTemplate.querySelector(".user__address");
    usersTemplate.querySelector(".address__street").textContent =
      user.address.street;
    usersTemplate.querySelector(".address__suite").textContent =
      user.address.suite;
    usersTemplate.querySelector(".address__city").textContent =
      user.address.city;
    usersTemplate.querySelector(".address__zipcode").textContent =
      user.address.zipcode;
    usersTemplate.querySelector(".geo__link").href =
      "https://www.google.com/maps/place/-37.3159,81.1496" +
      user.address.geo.lat +
      "," +
      user.address.geo.lng;
    usersTemplate.querySelector(".user__phone").textContent = user.phone;
    usersTemplate.querySelector(".user__website").href =
      "https://www." + user.website;
    usersTemplate.querySelector(".company__name").textContent =
      user.company.name;
    usersTemplate.querySelector(".company__catch-phrase").textContent =
      user.company.catchPhrase;
    usersTemplate.querySelector(".company__bs").textContent = user.company.bs;
    usersFragment.appendChild(usersTemplate);
  });
  element.appendChild(usersFragment);
}

async function fetchUsers(request = "users", id) {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/" + request
    );
    const data = await response.json();

    if (request === "posts") {
      filterPosts(id, data);
    } else {
      renderUsers(data, elUsersList);
    }
  } catch (err) {
    console.log(err, "error");
  }
}

fetchUsers();

function renderPosts(filteredPosts, element) {
  const postsFragment = document.createDocumentFragment();
  filteredPosts.forEach((post) => {
    element.innerHTML = null;
    const postTemplate = elPostsTemplate.cloneNode(true);
    postTemplate.querySelector(".posts__item").dataset.post_id = post.id;
    postTemplate.querySelector(".post__title").textContent = post.title;
    postTemplate.querySelector(".post__text").textContent = post.body;
    postsFragment.appendChild(postTemplate);
  });
  element.appendChild(postsFragment);
}

function filterPosts(userID, data) {
  const userPosts = data.filter((post) => {
    return post.userId == userID;
  });
  renderPosts(userPosts, elPostsList);
}

elUsersList.addEventListener("click", (evt) => {
  document.querySelectorAll(".users__item").forEach((li) => {
    li.style.opacity = 'white';
  });
  const clickedUserId = evt.target.closest("li").dataset.user_id;
  evt.target.closest("li").style.opacity = "1";
  elCommentsList.innerHTML = null;
  fetchUsers("posts", clickedUserId);
});

function renderComments(comments, element) {
  element.innerHTML = null;
  const commentsFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentTemplate = elCommentsTemplate.cloneNode(true);
    commentTemplate.querySelector(".comments__user-name").textContent =
      comment.name;
    commentTemplate.querySelector(".comments__user-email").textContent =
      comment.email;
    commentTemplate.querySelector(".comments__user-comment").textContent =
      comment.body;
    commentsFragment.appendChild(commentTemplate);
  });
  element.appendChild(commentsFragment);
}

async function fetchComments(id) {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/comments?postId=" + id
    );
    const data = await response.json();
    renderComments(data, elCommentsList);
  } catch (err) {
    console.log(err, "error");
  }
}

elPostsList.addEventListener("click", (evt) => {
  const clickedPostId = evt.target.closest("li").dataset.post_id;
  fetchComments(clickedPostId);
});