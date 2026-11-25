NIMESH SHRESTHA – CV WEBSITE
=============================

WHAT'S IN THIS FOLDER
  index.html     The website page (layout).
  style.css      Colours, fonts, design.
  script.js      Makes the page interactive (filters, search, typing effect...).
  data.js        >>> ALL YOUR CV CONTENT. This is the file you change. <<<
  editor.html    A friendly form for editing data.js without touching code.
  images/        photo.jpg (waterfront photo), headshot.jpg (portrait),
                 og-image.jpg (the preview card LinkedIn shows when the link is shared).
  files/         Nimesh_Shrestha_CV.pdf (the "Download CV" button).

HOW TO ADD A SKILL / JOB / PROJECT
  Option A (easiest):
    1. Double-click editor.html (opens in Chrome).
    2. Add or change anything. Click "Preview site" to check it.
    3. Click "Download data.js", then move the downloaded data.js into this
       folder, replacing the old one.
  Option B: open data.js in Notepad / VS Code and copy an existing entry.

  Change the photo: put a new picture in images/ named photo.jpg.
  Update the PDF:   replace files/Nimesh_Shrestha_CV.pdf (keep the same name).
  Show phone number on the site: in data.js set  "showPhone": true

PREVIEW ON THIS PC
  Just double-click index.html.

PUT THE CHANGES ONLINE (after the site is on GitHub Pages)
  Open a terminal in this folder and run:
     git add .
     git commit -m "Update CV"
     git push
  The live link updates in about 1 minute.
  (Or drag the changed files into the repo on github.com -> "Add file" -> "Upload files".)
