//generate img api

//Form validation 
const form = document.getElementById('.img-form');

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
        errorSpan.classList.add('hidden');

        //resets original margin
        input.style.marginBottom = '20px';
        Field.style.marginBottom = '0';
    });
};

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
        errorMessage: (input, label) => `Is Not a Valid ${label.textContent}`
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
            errorSpan.classList.remove('hidden');
            
            //sets new margin since there is an error
            input.style.marginBottom = '0';
            formField.style.marginBottom = '20px';
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
        errorSpan.classList.add('hidden');
        input.style.marginBottom = '20px';
        formField.style.marginBottom = '0';
        console.log('Field infomation has been entered correctly')

        //save email value to variable
        const email  = input.value;

        //save to array
        //checks if local stoarge already has an email then sets new local storage value

        // set local storage to email value 
        // set local storage with img file id/name
    
        // make object array of email and image
        // add email and image ohject array
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
        resetFields(form);
        form.submit(); 
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

// new image geranation for same email

//new image generation for new email

//display imgs and email saved in local storage

