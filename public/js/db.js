// offline database
db.enablePersistence()
  .catch(err => {
    if(error.code == 'failed-precondition'){
      // Multiple tabs open
      console.log('Persistence Failed')
    } else if (error.code == 'uniplemented') {
      // lack of browser support
      console.log('persistence not available')
    }
  });

// real time listener
db.collection('recipes').onSnapshot((snapshot) => {
  //console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    //console.log(change, change.doc.data(), change.doc.id);
    if (change.type === 'added'){
      //add document data to the web page
      renderRecipe(change.doc.data(), change.doc.id);

    }
    if (change.type === 'remove'){
      //remove document data from web page
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipes
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  // prevent form from reload the page
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection('recipes').add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
});

// delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
  //console.log(evt);
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    db.collection('recipes').doc(id).delete();
  }
});
