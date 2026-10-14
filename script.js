/*
  WAITLIST
  Paste your Google Form link between the quotes below. This is the only
  line you need to change.

  So this page can send First name and Email itself:
  1. Create a Google Form with two short-answer questions, in this order:
     First name, then Email address.
  2. Settings: turn responses on. Do not require people to sign in.
  3. More (three dots) → Get pre-filled link.
  4. Type FIRST in First name and EMAIL in Email. Click Get link. Copy it.
  5. Replace the link below with that copied link. Save, then upload this file.

  A normal viewform link also works. The button will open that form in a new
  tab instead of sending the answers from this page.
*/
var GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfM6CD3jEkCGe5G-vvVE5jI7-_nyR-PDa70VXmlRcRBgYdwQA/viewform?usp=pp_url&entry.2005620554=FIRST";

(function () {
  var form = document.getElementById("waitlist-form");
  if (!form) {
    return;
  }

  var firstName = document.getElementById("first-name");
  var email = document.getElementById("email");
  var status = document.getElementById("form-status");
  var submitButton = form.querySelector("[type='submit']");
  var config = readFormLink(GOOGLE_FORM_LINK);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var firstInvalid = validate();
    if (firstInvalid) {
      setStatus("");
      firstInvalid.focus();
      return;
    }

    if (!config.id) {
      setStatus("The waitlist is not connected yet. Email admin@functionalmail.com and we’ll add you.");
      return;
    }

    if (!config.firstEntry) {
      var opened = window.open(config.publicUrl, "_blank", "noopener");
      if (opened) {
        setStatus("A Google Form opened in a new tab. Finish joining there. This page did not send your name yet.");
      } else {
        setStatus("Allow pop-ups, or open the waitlist form directly, then submit it there.");
      }
      return;
    }

    postToGoogle();
  });

  function readFormLink(raw) {
    var text = String(raw || "").trim().replace(/&amp;/g, "&");
    var embedded = text.match(/src=["']([^"']+)["']/i);
    if (embedded) {
      text = embedded[1];
    }

    var result = {
      id: "",
      publicUrl: "",
      firstEntry: "",
      emailEntry: ""
    };

    if (!text || text.indexOf("YOUR_FORM_ID") !== -1) {
      return result;
    }

    var idMatch = text.match(/\/forms\/d\/e\/([a-zA-Z0-9_-]+)/);
    if (!idMatch) {
      result.publicUrl = text;
      return result;
    }

    result.id = idMatch[1];
    result.publicUrl = "https://docs.google.com/forms/d/e/" + result.id + "/viewform";

    var entries = [];
    try {
      var params = new URL(text).searchParams;
      params.forEach(function (value, key) {
        var entryMatch = key.match(/^entry\.(\d+)$/);
        if (entryMatch) {
          entries.push({ id: entryMatch[1], value: String(value || "").trim().toUpperCase() });
        }
      });
    } catch (error) {
      return result;
    }

    entries.forEach(function (entry) {
      if (entry.value === "FIRST") {
        result.firstEntry = entry.id;
      }
      if (entry.value === "EMAIL") {
        result.emailEntry = entry.id;
      }
    });

    if ((!result.firstEntry || !result.emailEntry) && entries.length === 2) {
      result.firstEntry = entries[0].id;
      result.emailEntry = entries[1].id;
    }

    return result;
  }

  function validate() {
    var firstInvalid = null;
    var nameMessage = firstName.value.trim() ? "" : "Enter your first name.";
    var emailValue = email.value.trim();
    var emailMessage = "";

    if (!emailValue) {
      emailMessage = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      emailMessage = "Enter an email address like name@example.com.";
    }

    setFieldError(firstName, nameMessage);
    setFieldError(email, emailMessage);

    if (nameMessage) {
      firstInvalid = firstName;
    } else if (emailMessage) {
      firstInvalid = email;
    }

    return firstInvalid;
  }

  function setFieldError(input, message) {
    var error = document.getElementById(input.getAttribute("aria-describedby"));
    if (!error) {
      return;
    }
    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.hidden = false;
      error.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      error.hidden = true;
      error.textContent = "";
    }
  }

  function setStatus(message) {
    status.textContent = message;
  }

  function addField(postForm, name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    postForm.appendChild(input);
  }

  function postToGoogle() {
    var emailValue = email.value.trim();
    var frameName = "waitlist-frame";
    var frame = document.getElementById(frameName);
    var token = String(Math.floor(Math.random() * 1e16));
    var postForm = document.createElement("form");

    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = frameName;
      frame.name = frameName;
      frame.hidden = true;
      frame.title = "Waitlist submit";
      document.body.appendChild(frame);
    }

    postForm.method = "POST";
    postForm.action = "https://docs.google.com/forms/d/e/" + config.id + "/formResponse";
    postForm.target = frameName;
    postForm.acceptCharset = "UTF-8";
    addField(postForm, "entry." + config.firstEntry, firstName.value.trim());
    if (config.emailEntry) {
      addField(postForm, "entry." + config.emailEntry, emailValue);
    }
    addField(postForm, "emailAddress", emailValue);
    addField(postForm, "fvv", "1");
    addField(postForm, "pageHistory", "0");
    addField(postForm, "fbzx", token);
    addField(postForm, "partialResponse", '[null,null,"' + token + '"]');
    addField(postForm, "submissionTimestamp", "-1");
    document.body.appendChild(postForm);
    submitButton.disabled = true;
    submitButton.textContent = "Joining…";
    setStatus("Sending your note…");
    postForm.submit();
    window.setTimeout(function () {
      postForm.remove();
      showSuccess();
    }, 1200);
  }

  function showSuccess() {
    var message = document.createElement("p");
    message.className = "success";
    message.setAttribute("role", "status");
    message.tabIndex = -1;
    message.textContent = "You’re on the list. We’ll write when accounts open.";
    form.replaceWith(message);
    message.focus();
  }
})();
