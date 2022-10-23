//Define
var isValid = false;
const currentUrl = window.location.protocol + '//' + window.location.host;


jQuery('#reload-icon').on('click', function(e) {
  e.preventDefault();
  async function reloadWebsite() {
    const res = await fetch('/reload-browser')
      .then(res => {
      return res.json()
      })
      .then(res => {
        if(res.message === "ok") {
          location.reload()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  reloadWebsite();
})

jQuery('#success-flash .cross-icon').on('click', function(e) {
  e.preventDefault();
  jQuery(this).parent().css({'opacity': 0});
})

jQuery('.delete-website').on('click', function(e) {
  if (!confirm('Are you sure?')) {
    e.preventDefault();
  } else {
    const website_id = jQuery(this).attr('website-id');
    data = { website_id }

    const body = JSON.stringify({data: data});
    const url = "/delete-website";
    
    async function deleteWebsite() {
      const response = await fetch(
        url,
        {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: body,
        }).then(response => response.json())
          .then(data => {
          
            if(data.message === "ok") {
              window.location.reload(); 

            } else {
              console.log(data.message);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
      
    deleteWebsite();
    }
  })

  //Toggle settings menu dropdown
  jQuery('.settings').on('click', function(e) {
    e.preventDefault();
    jQuery(this).next('.sub-menu').toggleClass('hidden');
  })

  jQuery('.logout-link').on('click', function(e) {
    e.preventDefault();
    const logout = true;

    data = {
      logout
    }

    const body = JSON.stringify({data: data});
    const url = "/logout";

    async function logOut() {
      const response = await fetch(
        url,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        }).then(response => response.json())
          .then(data => {
          
            if(data.message === "ok") {
              window.location.href = `${currentUrl}/login` 

            } else {
              console.log("There was an error.")
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }

    logOut();
})

jQuery('#add-website-submit').on('click', function(e) {
  e.preventDefault();

  if(isValid) {
    const website = jQuery('#addwebsite').val();

    data = {
      website
    }

    const body = JSON.stringify({data: data});
    const url = "/add-website";
  
    async function addWebsite() {
      const response = await fetch(
        url,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        }).then(response => response.json())
          .then(data => {
           
            if(data.message === "ok") {
              jQuery('#success-flash').css({'opacity': 1});

              setTimeout(() => {
                window.location.reload();
              }, 3000)
  

            } else {
              console.log("There was an error.")
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
  
    addWebsite();

  } 
})

//Validate website url
jQuery('#addwebsite').keyup(function() {
  const el = document.getElementById("addwebsite").value;
  if(el) {
      if(el.length > 7) {
        if(isUrlValid(el)) {
          jQuery('.add-website-error').html("<img src='/img/checked.svg'>");
          isValid = true;
        } else {
          jQuery('.add-website-error').html("<img class='error-icon' src='/img/Error-Icon.png'><span class='error-text'>Invalid URL</span>");
          isValid = false;
        }
      } 
  }
})

//Process login form
jQuery('#login-user').on('click', (e) => {
  e.preventDefault();
  var errors = []; 
  var errorContainer = document.querySelector('.login-errors');
  var ul = '<ul>';
  
  const email = jQuery('#email').val();
  const pass = jQuery('#pass').val();

  data = {
    email,
    pass
  }

  if(data.email === "") {
    errors.push("Email field is blank");
  }
  if(data.pass === "") {
    errors.push("Password field is blank");
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
                window.location.href = `${currentUrl}/dashboard`;
              }
            }

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
  if(data.pass === "") {
    errors.push("Password field is blank");
  }

  if(!validateEmail(data.email)) {
    errors.push("Email is invalid");
  }

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

//Check if email is valid
function validateEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if($email !== "") {
    return emailReg.test( $email );
  } else {
    return false;
  }
}

//Check if url is valid
function isUrlValid(url) {
  return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

