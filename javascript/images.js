//generate img api javascript for entire interface
const url = `https://picsum.photos/v2/list?limit=100`;

//set variables and get needed feilds 
const currentEmailTitle = document.getElementById('currentemail');
const generateButton = document.querySelector('.generate-img');
const addToCollection = document.querySelector('.add-img');
const generateButtonRow = document.querySelector('generate-button-row');
const buttonRow = document.querySelector('button-row');
const switchEmail = document.querySelector('.switch-email');
const selectEmailForm = document.getElementById('selectemailbox');
const successMessage = document.querySelector('.message-text');
const imgbox = document.querySelector('.img-container');
const messages = document.querySelector('.messages');
const form = document.getElementById('img-form');
const formbox = document.getElementById('img-form-box');
const currentEmailDisplayTitle = document.getElementById('currentdisplayemail');
const displayImgs = document.querySelector('.display-imgs');
const displayImgsBox = document.querySelector('.display-imgs-box');
let currentEmail = ""; 

// setting email list function
const getemailList = () => {
    if (!localStorage.getItem("emailList")) {
        let emailList = ['guest'];
        localStorage.setItem("emailList", JSON.stringify(emailList));
    } 
    return JSON.parse(localStorage.getItem("emailList"));
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function fetchapi(url) {
    return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('error with loading imgs', error))
}

function imgrandom(data) {
        const randomPhoto = data[Math.floor(Math.random() * data.length)];
        
        const photoId = randomPhoto.id; 
        const photoAuthor = randomPhoto.author;
        const photoUrl = randomPhoto.download_url;

        let img = document.querySelector('.img-container img');
        img.id = photoId;
        img.src = photoUrl;
        img.alt = `Photo by ${photoAuthor}`;

        const currentPhoto = randomPhoto;

        return currentPhoto;
}

fetchapi(url).then(data => imgrandom(data));

const emails = () => {
    let selectionList = getemailList();

    let options = ['guest'];

    let selectEmailOption = document.getElementById('selectemail');
    
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

//Resets the form field errors allowing them to send more messeges later
const resetFields = formToReset => {
    const ResetFields = Array.from(formToReset.querySelectorAll('.form-field'));

    ResetFields.forEach(Field => {
        const label = Field.querySelector('label');
        const input = Field.querySelector('input');
        const errorSpan = Field.querySelector('.error-message');

        // sets the field to blank, resets the border colour and hides both icons and error messege    
        input.value = '';
        input.style.borderColor = '#2c2c2c';
        errorSpan.textContent = '';       
        errorSpan.classList.add('invisble');

    });
};

//saving email function 
const saveemail = () => {

    let email = form.elements.email.value;

    let emailList = JSON.parse(localStorage.getItem("emailList"));

    emailList.push(email);

    localStorage.setItem("emailList", JSON.stringify(emailList));

    let select = document.getElementById('selectemail');

    const option = document.createElement('option');
    option.text = email;
    option.value = email;
    select.add(option);

    resetFields(form);

    currentEmailDisplayTitle.textContent = `All Images For Current Email: ${email}`;
    currentEmailTitle.textContent = `Current Email: ${email}`;
    form.classList.add('hidden');
    formbox.style.display = 'none';
    messages.style.display = 'block';
    successMessage.textContent = `${email} has been successfuily added to email list.`;
    successMessage.classList.remove('hidden');
    successMessage.classList.remove('invisible');
    buttonRow.classList.remove('hidden');

    fetchapi(url).then(data => imgrandom(data));

    currentEmail = email;

    return currentEmail;
}

generateButton.addEventListener('click', () => {
  fetchapi(url).then(data => imgrandom(data));
});

addToCollection.addEventListener('click', () => {

    let imgarray = {};

    if (localStorage.getItem(currentEmail)) {
        imgarray = JSON.parse(localStorage.getItem(currentEmail));
    }

    let imgElement = document.querySelector('.img-container img');

    let imgData = {
        id: imgElement.id,
        src: imgElement.src,
        alt: imgElement.alt 
    }

    if (imgData.id in imgarray) {
        successMessage.textContent = `Current image could not be added to ${currentEmail} image collection.`;
        successMessage.style.color = '#d64541';
        successMessage.classList.remove('hidden');
        successMessage.classList.remove('invisible');
    } else {
        let img = document.querySelector('.img-container img');

        imgarray[imgData.id] = imgData;
        localStorage.setItem(currentEmail, JSON.stringify(imgarray));

        successMessage.textContent = `Current image has been successfully added to ${currentEmail} image collection.`;
        successMessage.style.color = '#10d53b';
        successMessage.classList.remove('hidden');
        successMessage.classList.remove('invisible');
    }

});

selectEmailForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let selectEmailOption = document.getElementById('selectemail');

    const selection = selectEmailOption.value
    currentEmailDisplayTitle.textContent = `All Images For Current Email: ${selection}`;
    currentEmailTitle.textContent = `Current Email: ${selection}`;
    successMessage.textContent = `Current Email has been successfully changed to ${selection}.`;
    successMessage.classList.remove('hidden');
    successMessage.classList.remove('invisible');

    currentEmail = selection;
});

displayImgs.addEventListener('click', () => {

    let displayContainer = document.querySelector('.display-imgs-box');
    
    // Clear the container first to avoid duplicating images on every click
    displayContainer.innerHTML = '';

    // Retrieve the data from local storage
    const storedData = localStorage.getItem(currentEmail);

    if (storedData) {
        // Convert string back into an object
        let imgarray = JSON.parse(storedData);

        // 4. Loop through the object properties
        Object.values(imgarray).forEach(imgData => {
            // reate a new image element
            let newImg = document.createElement('img');
            
            // Assign the stored values
            newImg.id = imgData.id;
            newImg.src = imgData.src;
            newImg.alt = imgData.alt;

            // Append the image to the display container
            displayContainer.appendChild(newImg);
        });
    } else {
        displayContainer.textContent = "No images found for this collection.";
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
            //changes the border to red, adds the error icon and error messege
            input.style.borderColor = '#C52626';
            errorSpan.textContent = option.errorMessage(input, label);
            errorSpan.classList.remove('invisible');
            
            //sets new margin since there is an error
            console.log('Errors with the infomation that has been entered into the field')

            //since error was found sets the error value to true
            formFieldError = true;
        }
    }
    //if no errors are found the error value stays false so the next if statment can check it

    // checks for no errors and styles the form accordingly uses formfielderror value to check this
    if (!formFieldError) {
        //changes the border back to normal, remove the error messege and adds the success icon to confirm it is entered correctly
        input.style.borderColor = '#2c2c2c';
        errorSpan.textContent = '';       
        errorSpan.classList.add('invisible');
        
        console.log('Field infomation has been entered correctly')

        //save email value to variable
       const email = form.elements.email.value;

       //check if email already exists
       let emailList = JSON.parse(localStorage.getItem("emailList"));

       if (emailList.includes(email)) {
            errorSpan.textContent = `current ${label.textContent} already exists`;
            errorSpan.classList.remove('invisible');
            formFieldError = true;
        } 
        
        if (!formFieldError) {
            saveemail();
        }

    }
    
    //logs the value of the field
    console.log(input.value);

    return formFieldError;
};


//pulls each formfield into an array for each selector in formfield
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


       // form.submit(); 
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

    // this will check when each field has infomation enttered into it, when the user moves onto the field it checks if the previous field is correct
    //this will be done both after submitting and before the first submit.
    // i use the blur event to achive this which checks when one field loses focus and another gains focus.
    Array.from(form.elements).forEach(element => {
    element.addEventListener('blur', (event) => {
        validateformField(event.srcElement.parentElement);
    });
    
});
};

//runs functions on page load waiting on entries for form validation to begin
resetFields(form);
validateForm();


