# Setting this up (one-time, about 10 minutes)

This replaces Supabase and Web3Forms. Everything lives in your own Google account —
nothing to pay for, nothing that goes to sleep.

## 1. Make a Google Sheet

This is where every enquiry gets logged as a row.

1. Go to sheets.google.com, create a blank sheet.
2. Name it "Harrow & Thread enquiries" (or anything).
3. Copy the ID from its address bar — the long code between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`
   Stop at the `/edit` — don't copy that or anything after it.

## 2. Make a Google Drive folder

This is where photos get saved.

1. Go to drive.google.com, create a new folder.
2. Name it "Harrow & Thread photos" (or anything).
3. Open it, copy the ID from its address bar the same way:
   `https://drive.google.com/drive/folders/`**`THIS_PART`**
   Your address bar may have extra text after the ID, starting with a `?` — something
   like `?usp=sharing`. **Stop at the `?` — don't copy that or anything after it.**
   The ID must end in a letter or a number. A trailing `?` broke the whole form
   silently for one evening — the sheet row and email never arrived either.

## 3. Create the script

1. Go to script.google.com, click **New project**.
2. Delete the sample code. Paste in the whole of `Code.gs` from this folder.
3. Near the top, paste your two IDs into `SHEET_ID` and `DRIVE_FOLDER_ID`.
4. Leave `NOTIFY_EMAIL` blank — enquiries will land in whichever Google account
   you deploy this under (step 4). Fill it in only if you want them to go
   somewhere else instead.
5. Click **Save** (the disk icon), name the project "Harrow & Thread enquiries".

## 4. Deploy it as a web address

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type", choose **Web app**.
3. "Execute as": **Me**. "Who has access": **Anyone**.
4. Click **Deploy**. Google will ask you to authorise it — click through, it's
   your own script asking to use your own Sheet/Drive/Gmail.
5. Copy the URL it gives you — it ends in `/exec`.

**If that popup closed before you copied it:** go to **Deploy → Manage deployments**.
Your deployment is listed there, with the URL and a copy button next to it. There's
also a **Test deployments** option elsewhere in the Deploy menu — don't use that one,
its URL ends in `/dev` and isn't the live one.

## 5. Tell the website about it

In the site's `.env` file, add:

```
PUBLIC_GAS_URL=<the /exec URL you just copied>
```

Then rebuild the site (`npm run build`). That's it — no other file changes needed.

## If you ever need to change the script

Edit it at script.google.com, then **Deploy → Manage deployments → edit (pencil
icon)**. Click the **Version** dropdown and pick **New version** — it does not
default to this, and if you skip it the **Deploy** button stays greyed out and
does nothing. Then click **Deploy**. Just saving the file is not enough — it has
to be redeployed as a new version, or the live URL keeps running the old code.
