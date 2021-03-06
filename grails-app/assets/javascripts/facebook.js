//facebook registration
// initialize and setup facebook js sdk
var accessToken, userId, expireIn;
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1443930665645356',
        xfbml      : true,
        cookie     : true,
        version    : 'v2.9'
    });
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// login with facebook with extra permissions
function registerWithFacebook(companyName, userType) {
    FB.login(function(response) {
        if (response.status === 'connected') {
            accessToken = response.authResponse.accessToken;
            userId = response.authResponse.userID;
            expireIn = response.authResponse.expiresIn;
            FB.api('/me', 'GET', {fields: 'name,email,id'}, function(response) {
                var fullName = response.name;
                var email = response.email;
                var userAccountId = response.id;
                var providerName = 'FACEBOOK';
                if(email && fullName && userAccountId && providerName) {
                    registrationWithProvider(email, fullName, userAccountId, providerName, accessToken, expireIn, companyName, userType);
                } else {
                    alert('Something error. Please try again');
                }
            });
        } else if (response.status === 'not_authorized') {
            alert('You are not logged in.');
        } else {
            alert('You are not logged into Facebook.');
        }
    }, {scope: 'email,manage_pages,publish_pages'});
}



// login with facebook with extra permissions
function loginWithFacebook() {
    FB.login(function(response) {
        if (response.status === 'connected') {
            accessToken = response.authResponse.accessToken;
            userId = response.authResponse.userID;
            expireIn = response.authResponse.expiresIn;
            var paramsData = {userId: userId, accessToken: accessToken, expireIn: expireIn};
            $.post( "socialLogin", paramsData, function( data ) {
                if(data.hasError) {
                    window.location.href='/GrailsSocial/register/register';
                } else {
                    window.location.href='/GrailsSocial/home';
                }
                var datas = data;
            });
        } else if (response.status === 'not_authorized') {
            alert('You are not logged in.');
        } else {
            alert('You are not logged into Facebook.');
        }
    }, {scope: 'email,manage_pages,publish_pages'});
}

function checkValidationSocialRegistration() {
    var form = $('#registerForm');
    var valid = form.validate(
        {
            rules: {
                companyName: "required"
            },
            message: {
                companyName: "Please provide company Name"
            }
        }
    );
    if(form.valid()) {
        var companyName = $('#companyName').val();
        var userType = $('#registerForm input[name=userType]:checked').val();
        registerWithFacebook(companyName, userType);
    }
}

function loadPages(companyName, userType) {
    FB.getLoginStatus(function (response) {
        if (response) switch (response.status) {
            case 'connected':
                FB.api('/me/accounts', function (response) {
                    if (!response || response.error || !response.data) {
                    } else {
                        var select = $('#pages');
                        select.empty();
                        select.append($("<option></option>")
                            .attr("value", -1)
                            .text("My Page"));
                        $.each(response.data, function (i, page) {
                            select
                                .append($("<option></option>")
                                    .attr("value", page.id)
                                    .text(page.name).attr('access_token', page.access_token));
                        });
                    }
                });
                break;
            case 'unknown': {
                linkedWithFacebook(companyName, userType);
                break;
            }
            default:
            {
                var select = $('#pages');
                select.empty();
                break;
            }

        } else {
            linkedWithFacebook(companyName, userType);
        }
    },{scope:'manage_pages'});
}

function linkedWithFacebook(companyName, userType) {
    FB.login(function(responseFb) {
        if (responseFb.status === 'connected') {
            accessToken = responseFb.authResponse.accessToken;
            userId = responseFb.authResponse.userID;
            expireIn = responseFb.authResponse.expiresIn;
            var paramsData = {
                accessToken: accessToken,
                userId: userId,
                expireIn: expireIn
            };
            $.post( "GrailsSocial/register/linkUpWIthFacebook", paramsData, function( data ) {
                if(data.hasError) {
                    alert(data.message)
                } else {
                    loadPages(companyName, userType);
                }
            });
        } else if (responseFb.status === 'not_authorized') {
            alert('You are not logged in.');
        } else {
            alert('You are not logged into Facebook.');
        }
    }, {scope: 'email,manage_pages,publish_pages'});
}

function postToPage() {
    var pageId = $('#pages').val();
    var message = $('#message').val();
    var pageToken = $('.facebook-pages option:selected').attr('access_token');
    FB.api('/' + pageId + '/feed', 'post',
        {
            message: message,
            access_token: pageToken,
            link: 'https://image.flaticon.com/teams/new/1-freepik.jpg',
        }, function(response) {
        console.log(response);
    });
}