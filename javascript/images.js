//generate img api javascript for entire interface

//api url
const url = `https://picsum.photos/v2/list?limit=100`;

//set variables and get needed feilds for script 
const currentEmailTitle = document.getElementById('currentemail');
const generateButton = document.querySelector('.generate-img');
const addToCollection = document.querySelector('.add-img');
const generateButtonRow = document.querySelector('generate-button-row');
const buttonRow = document.querySelector('button-row');
const switchEmail = document.querySelector('.switch-email');
const selectEmailForm = document.getElementById('selectemailbox');
const successMessage = document.querySelector('.message-text');
const successMessageEmail = document.querySelector('.message-text2');
const imgbox = document.querySelector('.img-container');
const messages = document.querySelector('.messages');
const messagesEmail = document.querySelector('.messages2');
const form = document.getElementById('img-form');
const formbox = document.getElementById('img-form-box');
const currentEmailDisplayTitle = document.getElementById('currentdisplayemail');
const displayImgs = document.querySelector('.display-imgs');
const displayImgsBox = document.querySelector('.display-imgs-box');
const errorSpanMessage = document.querySelector('.error-message');

//email variable set to global
let currentEmail = ""; 

// setting email list function
//gets the email list from local storage
//guest is the default user
const getemailList = () => {
    if (!localStorage.getItem("emailList")) {
        let emailList = ['guest'];
        localStorage.setItem("emailList", JSON.stringify(emailList));
    } 
    return JSON.parse(localStorage.getItem("emailList"));
}

//Promise status checker
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

//Fetch Api Function
function fetchapi(url) {
    return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('error with loading imgs', error))
}

//Image Randomiser from api image list
function imgrandom(data) {
        //sets the random value with a math method based on api list length
        const randomPhoto = data[Math.floor(Math.random() * data.length)];
        
        //set id, src and alt values based on the images id, author and download url
        const photoId = randomPhoto.id; 
        const photoAuthor = randomPhoto.author;
        const photoUrl = randomPhoto.download_url;

        let img = document.querySelector('.img-container img');
        img.id = photoId;
        img.src = photoUrl;
        img.alt = `Photo by ${photoAuthor}`;

        //save value for when it needs to be displayed
        const currentPhoto = randomPhoto;

        return currentPhoto;
}

// once api has been fetched then run the randomiser
fetchapi(url).then(data => imgrandom(data));

//setting the email list for switching emails
const emails = () => {
    let selectionList = getemailList();

    let options = ['guest'];

    let selectEmailOption = document.getElementById('selectemail');
    
    //uses for loop to loop through the list and set an option for each
    for ( i = 0; i < selectionList.length; i++) {
        let option = document.createElement("option");
        option.value = selectionList[i];
        option.text = selectionList[i];
        options.push(option);
    }

    selectEmailOption.replaceChildren(...options);

    currentEmail = 'guest';
    return currentEmail;
}

getemailList();
emails();

//Resets the form field and error messages
const resetFields = formToReset => {
    const ResetFields = Array.from(formToReset.querySelectorAll('.form-field'));

    ResetFields.forEach(Field => {
        const label = Field.querySelector('label');
        const input = Field.querySelector('input');
        const errorSpan = Field.querySelector('.error-message');

        // sets the field to blank, resets the border colour and hides error messege    
        input.value = '';
        input.style.borderColor = '#2c2c2c';
        errorSpan.textContent = '';       
        errorSpan.classList.add('invisible');
        successMessageEmail.classList.add('invisible');

    });
};

//saving email function 
const saveemail = () => {

    let email = form.elements.email.value;

    let emailList = JSON.parse(localStorage.getItem("emailList"));

    //add email to option box and local storage
    emailList.push(email);

    localStorage.setItem("emailList", JSON.stringify(emailList));

    let select = document.getElementById('selectemail');

    const option = document.createElement('option');
    option.text = email;
    option.value = email;
    select.add(option);

    resetFields(form);

    //set messeages and titles for user ability
    currentEmailDisplayTitle.textContent = `All Images For Current Email: ${email}`;
    currentEmailTitle.textContent = `Current Email: ${email}`;
    messagesEmail.style.display = 'block';
    successMessageEmail.textContent = `${email} has been successfuily added to email list.`;
    successMessageEmail.classList.remove('invisible');
    errorSpanMessage.classList.add('invisible');

    // reset display images box ready for button to be pressed and new images to be displayed
    let displayContainer = document.querySelector('.display-imgs-box');
    displayContainer.classList.add('invisible');
    
    //generate new image
    fetchapi(url).then(data => imgrandom(data));

    currentEmail = email;

    return currentEmail;
}

//generate images button just runs the radomiser
generateButton.addEventListener('click', () => {
  fetchapi(url).then(data => imgrandom(data));

  successMessage.classList.add('invisible');
});

//add to collection button function
addToCollection.addEventListener('click', () => {

    let imgarray = {};
    // checks if images for this user are already in local storage
    if (localStorage.getItem(currentEmail)) {
        imgarray = JSON.parse(localStorage.getItem(currentEmail));
    }

    let imgElement = document.querySelector('.img-container img');
    // gets values of image
    let imgData = {
        id: imgElement.id,
        src: imgElement.src,
        alt: imgElement.alt 
    }
    //if image is already in local storage for this user display error message
    if (imgData.id in imgarray) {
        successMessage.textContent = `Current image is already in ${currentEmail} image collection.`;
        successMessage.style.color = '#d64541';
        successMessage.classList.remove('invisible');
    } else {
        // if it is a new image then add it to local storage and display successfull message
        let img = document.querySelector('.img-container img');

        imgarray[imgData.id] = imgData;
        localStorage.setItem(currentEmail, JSON.stringify(imgarray));

        successMessage.textContent = `Current image has been successfully added to ${currentEmail} images collection.`;
        successMessage.style.color = '#10d53b';
        successMessage.classList.remove('invisible');

        ///resets display images container ready for new images to be displayed
        let displayContainer = document.querySelector('.display-imgs-box');
        displayContainer.classList.add('invisible');
    }
});

// select email form function which triggers on button click/submit of form
selectEmailForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let selectEmailOption = document.getElementById('selectemail');

    //sets global value of email and changes the interfaces detials for the chosen user 
    const selection = selectEmailOption.value
    currentEmailDisplayTitle.textContent = `All Images For Current Email: ${selection}`;
    currentEmailTitle.textContent = `Current Email: ${selection}`;
    successMessage.textContent = `Current Email has been successfully changed to ${selection}.`;
    successMessage.classList.remove('invisible');

    //resets display images container ready for new images to be displayed
    let displayContainer = document.querySelector('.display-imgs-box');
    displayContainer.classList.add('invisible');

    currentEmail = selection;
});

//dialog window for displaying the imgs larger
const dialog = document.getElementById('image-dialog');

//decided to use dialog box rather than an overlayed container as it has more felxible javascript and css functions

//display dialog function
function DisplayLargeImg() {
  const container = document.querySelector('.display-imgs-box');
  const dialogImg = dialog.querySelector('img');

  // Only proceeds if the display imgs container and has image children (if displayed images has been clicked to show images)
  if (container && container.querySelector('img')) {
    container.addEventListener('click', (event) => {
      // Check if the clicked element is an image
      if (event.target.tagName === 'IMG') {
        // Set the dialog's image source and Alt to the clicked image's source and Alt
        dialogImg.src = event.target.src;
        dialogImg.alt = `Larger Displayed Version of ${event.target.alt}`;
        // Open the dialog as a modal using css to style it
        dialog.showModal();
      }
    });
  }

  // Close the dialog when clicking outside the image
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}

DisplayLargeImg();

//display images in collection function when button is pressed
displayImgs.addEventListener('click', () => {

    let displayContainer = document.querySelector('.display-imgs-box');

    displayContainer.classList.remove('invisible');
    
    // Clear the container first to avoid duplicating images on every click
    displayContainer.innerHTML = '';

    // Retrieve the data from local storage
    const storedData = localStorage.getItem(currentEmail);

    let span = document.createElement('span');

    if (storedData) {
        // Converts string back into an object
        let imgarray = JSON.parse(storedData);

        //Loops through the object properties for each image getting the id, src and alt and setting them on the displayed images
        Object.values(imgarray).forEach(imgData => {

            let newImg = document.createElement('img');
            
            newImg.id = imgData.id;
            newImg.src = imgData.src;
            newImg.alt = imgData.alt;

            //adds the images to the container 

            let hasSpanChild = displayContainer.querySelector(':scope > span') !== null;

            // if it already has children remove current children so other users images arent displayed
            if (hasSpanChild) {
                displayContainer.removeChild(span);
            }

            displayContainer.appendChild(newImg);

            //reruns the dialog function so can be used for the new images
            DisplayLargeImg();
        });
    } else {
        // if local storage contains no imgs for this user display error message
        displayContainer.appendChild(span);
        span.textContent = "No images found in this collection.";
    }
});

//Form validation 
//validate form function
const validateForm = () => {
form.setAttribute('novalidate', '');

//validation options objects array
const validationOptions = [
    //checks if someone has entered text into field
    {
        attribute: 'required',
        isValid: input => input.value.trim() !== '',
        errorMessage: (input, label) => `${label.textContent} is required`
    },
    {
        attribute: 'required',
        isValid: input => input.value.trim() !== null,
        errorMessage: (input, label) => `${label.textContent} is required`
    },
    {
        attribute: 'required',
        isValid: input => input.value.trim() !== undefined,
        errorMessage: (input, label) => `${label.textContent} is required`
    },
    {
        //checks email agaisnt pattern provided for valid email
        attribute: 'pattern',
        isValid: input => {
            const patternRegEx = new RegExp(input.pattern);
            return patternRegEx.test(input.value);
        },
        errorMessage: (input, label) => `This is Not a Valid Email`
    }
]

//unpacks arrary into variables and checks for errors in said feild
const validateformField = formField => {
    const label = formField.querySelector('label');
    const input = formField.querySelector('input');
    const errorSpan = formField.querySelector('.error-message');

    //sets the error value to false by default    
    let formFieldError = false;

    //checks agaisnt the vaildation options for errors
    //uses the attrubute and the value of the input to determine if errors or not
    for (const option of validationOptions) {
        if(input.hasAttribute(option.attribute) && !option.isValid(input)) {
            //changes the border to red, adds the error messege
            input.style.borderColor = '#C52626';
            errorSpan.style.color = '#C52626'
            errorSpan.textContent = option.errorMessage(input, label);
            errorSpan.classList.remove('invisible');         

            //since error was found sets the error value to true
            formFieldError = true;
        }
    }
    //if no errors are found the error value stays false so the next if statment can check it

    // checks for no errors and styles the form accordingly uses formfielderror value to check this
    if (!formFieldError) {
        //changes the border back to normal, changes the error messege to show that it is a valid email to be submitted
        input.style.borderColor = '#2c2c2c';
        errorSpan.style.color = '#15ab36';
        errorSpan.textContent = `This is a Valid Email`;
        errorSpan.classList.remove('invisible');

        //check if email already exists
       let emailList = JSON.parse(localStorage.getItem("emailList"));

        //save email value to variable
       const email = form.elements.email.value;

        if (emailList.includes(email)) {
            //if email already exists in local storage then show an error message and not allow it to be submitted
            errorSpan.textContent = `current ${label.textContent} already exists`;
            errorSpan.classList.remove('invisible');
            formFieldError = true;
        }

    }

    return formFieldError;
};


//pulls the formfield into an array for each selector in formfield
const validateFormFields = formToValidate => {
    const formFields = Array.from(formToValidate.querySelectorAll('.form-field'));

    formFields.forEach(formField => {
        validateformField(formField);
    });

    //gathers the results of the form and checks if all fields are correct before submitting the form
    const results = formFields.map(formField => validateformField(formField));

    const allValid = results.every(result => result === false);

        if (allValid) {
            //logs if they are correct then submits the form
        console.log('All fields are valid! Proceed with submit.');

        //runs the save email function to add email to local storage email list
        saveemail();

    } else {
        // if errors found will log and not submit and will wait until errors are fixed and form is resubmitted to test again
        console.log('Some fields have errors.');
    }

    return allValid;
};

//when submitted check if errors found by validation function then stop submit.
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        validateFormFields(form);
    });

    // this will check when each field has infomation enttered into it, when the user clicks outside the field it checks if the field's email is valid
    //this will be done both after submitting and before the first submit.
    //I use the blur event to achive this which checks when one field loses focus and something else gains focus.
    Array.from(form.elements).forEach(element => {
    element.addEventListener('blur', (event) => {
        validateformField(event.srcElement.parentElement);
    });
    
});
};

//runs functions on page load waiting on entries for form validation to begin
resetFields(form);
validateForm();