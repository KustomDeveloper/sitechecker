// console.log('Running!')

jQuery('#add-website').on('click', function(e) {
  e.preventDefault();
  console.log('add website')
})

//Process login form
jQuery('#login-user').on('click', (e) => {
  e.preventDefault();
  
  const email = jQuery('#email').val();
  const pass = jQuery('#pass').val();

  data = {
    email,
    pass
  }

  const body = JSON.stringify({data: data});
  const url = "/login-user";

  async function loginUser() {
    const response = await fetch(
      url,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      }).then(response => response.json())
        .then(data => {
          console.log(data);
          if(data.message === "ok") {
            window.location.href = "http://localhost:8000/dashboard";  
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }

  loginUser();
});

//Process register form
jQuery('#register-user').on('click', (e) => {
  e.preventDefault();
  var errors = []; 
  var errorContainer = document.querySelector('.register-errors');
  var ul = '<ul>';
  
  const firstname = jQuery('#firstname').val();
  const lastname = jQuery('#lastname').val();
  const email = jQuery('#email').val();
  const pass = jQuery('#pass').val();

  data = {
    firstname,
    lastname,
    email,
    pass
  }

  if(data.firstname === "") {
    errors.push("First Name field is blank");
  }
  if(data.lastname === "") {
    errors.push("Last Name field is blank");
  }
  if(data.email === "") {
    errors.push("Email field is blank");
  }
  if(data.pass === "") {
    errors.push("Password field is blank");
  }

  console.log(data);

  const body = JSON.stringify({data: data});
  const url = "/register-user";

  async function registerUser() {
    const response = await fetch(
      url,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      }).then(response => response.json())
        .then(data => {
        if(errors.length != 0) {
            errorContainer.innerHTML = "";
            errors.forEach(function(error) {
              ul += '<li>'+ error + '</li>';
            }); 
            ul += '</ul>';

            //Show errors
            errorContainer.innerHTML = ul;

          } else {
            if(data.message != "ok" ) {
              errorContainer.innerHTML = "";
              errors.push(data.message);
              errors.forEach(function(error) {
              ul += '<li>'+ error + '</li>';
              }); 
              ul += '</ul>';

              //Show errors
              errorContainer.innerHTML = ul;

            } else {
              if(errors.length != 0) {
                errorContainer.innerHTML = "";
                errors.forEach(function(error) {
                  ul += '<li>'+ error + '</li>';
                }); 
                ul += '</ul>';

                //Show errors
                errorContainer.innerHTML = ul;

              } else {
                //On Success: Redirect to login page
                window.location.href = `http://localhost:8000/login`;
              }
            }

          }
        
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  registerUser();

});

