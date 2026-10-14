# Functional Mail

A small static website for [functionalmail.com](https://functionalmail.com). It is plain HTML, CSS, and one short script, so it can live on free GitHub Pages. There is no app to install and no server to run.

The waitlist is a Google Form. The website address and your Google Workspace email can both use `functionalmail.com` at the same time. Web traffic follows A and CNAME records. Mail follows MX records. You will only change the website records.

## What to edit before you publish

1. Open `script.js`. Replace the `GOOGLE_FORM_LINK` line with your form link. The steps are in [Connect the Google Form](#6-connect-the-google-form) below.
2. Support mail goes to `admin@functionalmail.com`. The footer, privacy page, and terms page already use that address.

## 1. Create a GitHub repository

If you already made the repository, skip to step 2.

1. Go to [github.com/new](https://github.com/new).
2. Name it something like `functionalmail-site`.
3. Set it to **Public**. Free GitHub Pages on a free account needs a public repository.
4. Do not add a README, .gitignore, or license in the GitHub form. This folder already has the site files.
5. Click **Create repository**. Leave the empty-repo page open. You need the repository URL, which looks like `https://github.com/YOUR_USERNAME/functionalmail-site.git`.

## 2. Upload these files

The site files have to sit in the **root** of the repository, not inside an extra folder. GitHub Pages should see `index.html` as soon as it opens the repo.

### From your computer, with Git

In a terminal, from this folder:

```bash
git init
git add .
git commit -m "Add the Functional Mail landing page."
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/functionalmail-site.git
git push -u origin main
```

Replace the remote URL with the one GitHub showed you. If `git remote add` says the remote already exists, use `git remote set-url origin` with that same URL, then push.

### Without Git

On the repository page, click **Add file** → **Upload files**. Drag in everything in this folder, including `images`, `CNAME`, and `.nojekyll`. Commit the upload to the `main` branch.

`.nojekyll` tells GitHub to publish the files as they are. It is easy to miss because the name starts with a dot. Include it.

## 3. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set the branch to **main** and the folder to **/ (root)**.
5. Save.

GitHub will publish the site at `https://YOUR_USERNAME.github.io/functionalmail-site/` in a minute or two. Check that address before you point the real domain at it.

## 4. Connect functionalmail.com

1. Still in **Settings** → **Pages**, under **Custom domain**, enter `functionalmail.com`.
2. Click **Save**.
3. Leave **Enforce HTTPS** off until GitHub says the DNS check succeeded. The certificate cannot be issued before the domain points here.
4. The `CNAME` file in this folder already contains `functionalmail.com`. GitHub reads that file. If GitHub offers to commit a CNAME file for you, that is the same thing.

Also verify the domain so nobody else can attach it to a different Pages site: GitHub’s Pages settings will show a TXT record for verification. Add that TXT record at Squarespace. A TXT record does not affect email.

## 5. Configure the DNS records at Squarespace

Your domain stays at Squarespace. Only the website records change. **Do not delete or edit your Google Workspace MX records.** Also leave these alone:

- TXT records for Google verification, SPF, or DKIM
- CNAME records whose name looks like `google._domainkey` or otherwise belongs to email

Mail keeps going to Google Workspace because those records stay put. You can do this during the day. Send yourself a test message afterward to confirm.

### What to remove

Squarespace’s default records point the *website* at Squarespace. Those are the ones that have to go, or they will fight GitHub.

1. Open the [Squarespace domains dashboard](https://account.squarespace.com/domains).
2. Click `functionalmail.com`.
3. Click **DNS**, then **DNS Settings**.
4. If the domain is also connected to a Squarespace *website*, disconnect that website connection first. Otherwise Squarespace may put the website records back. This does not cancel Google Workspace.
5. If there is a domain-forwarding rule sending `functionalmail.com` to a Squarespace page, delete that rule. Forwarding conflicts with the new website records.
6. Under DNS Settings, remove the **Squarespace Defaults** website preset (the red trash can next to those defaults).

Before you confirm the delete, read the list. It should be website records: A records, and a `www` record pointing at Squarespace. If MX records are in that list, cancel. Delete only the website A records and the Squarespace `www` record one at a time instead.

When you add GitHub’s records, Squarespace may say a record conflicts. Use **Replace record** only when the conflict is a Squarespace website A record or `www` CNAME. Never replace an MX record.

### What to add

Click **Add record** for each row. For the root domain, the name is `@`. If Squarespace won’t accept `@`, leave the name blank. That means the same thing.

Point the root domain at GitHub Pages with these **A** records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Add these **AAAA** records too, so the site also answers on IPv6:

| Type | Name | Value |
| --- | --- | --- |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

Point `www` at your GitHub Pages host. This is your username, not the repository name:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `YOUR_USERNAME.github.io` |

No `https://`, and no repository name on the end. If GitHub shows a different host on the Pages settings screen, use that value.

### After the records are saved

DNS can take a few minutes, and sometimes up to 48 hours. GitHub will check the domain on its own.

1. When the check mark appears next to `functionalmail.com` in Pages settings, turn on **Enforce HTTPS**.
2. Visit `https://functionalmail.com`.
3. Send a normal email to your existing Workspace address to confirm mail still arrives.

`www.functionalmail.com` should redirect to `functionalmail.com` once both the A records and the `www` CNAME are in place, because the custom domain in GitHub is the root domain.

These addresses come from [GitHub’s custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). If GitHub’s docs ever list different IPs, use the docs.

## 6. Connect the Google Form

1. Go to [Google Forms](https://docs.google.com/forms) and create a form. Title it something like “Functional Mail early access.”
2. Add two **Short answer** questions, in this order: **First name**, then **Email address**. You can turn on email validation for the second question in Google’s question menu.
3. Open the form’s **Settings**. Responses should be on. Do **not** require sign-in. Anyone with the link should be able to submit.
4. Click the three dots beside the Send button and choose **Get pre-filled link**.
5. Type `FIRST` in First name and `EMAIL` in Email. Those two words are how the website knows which answer is which.
6. Click **Get link**, then copy it. It will look similar to this:

   `https://docs.google.com/forms/d/e/1FAIpQLS.../viewform?usp=pp_url&entry.1234567890=FIRST&entry.0987654321=EMAIL`

7. Open `script.js`. Replace the placeholder `GOOGLE_FORM_LINK` with that whole link. Leave the quotes.
8. Save, commit, and push. GitHub Pages will update in a minute or two.

Submit a test from the live site, then open the form’s **Responses** tab and confirm your test is there.

If you paste a plain form link instead of the pre-filled one, the button opens the Google Form in a new tab. People would have to type their name again. The pre-filled link lets them use the form on your page.

To take the waitlist down later, set the Google Form to stop accepting responses. You do not have to change the website to do that.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `styles.css` | Black and cream layout |
| `script.js` | Waitlist checks and the Google Form link |
| `privacy.html` | Privacy note |
| `terms.html` | Terms note |
| `404.html` | Missing-page message |
| `CNAME` | Tells GitHub Pages the domain is `functionalmail.com` |
| `images/logo.svg` | Envelope mark |
| `images/hero-desk.jpg` | Desk photograph |
| `images/inbox-still.jpg` | Envelope photograph |
| `.nojekyll` | Publishes the site without Jekyll |

## Check it on your computer

Open `index.html` in a browser, or from this folder run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`. The waitlist will not actually file a response until `script.js` has your Google Form link and the page is served over the web.
