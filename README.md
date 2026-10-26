# OEMTools

Utilities for emergency-management workflows.

## CTR File Renamer

Open `ctr-renamer.html` in Chrome or Edge, or use the GitHub Pages site.

1. Add completed fillable CTR PDFs.
2. Review employee names and work dates.
3. Choose an export folder and allow browser access.
4. Select **Export all PDFs** to save each report separately.

Files follow `Employee_or_Crew_CTR_YYYY-MM-DD_to_YYYY-MM-DD.pdf`.
Two-digit years mean 2000–2099. One work date produces a single-date filename.
Multiple employees require a crew/group name. Missing fields and scanned or flattened PDFs require manual entries.
Existing export filenames receive numbered suffixes. PDF contents remain byte-identical; source files are unchanged.

The utility runs entirely in the browser without accounts or network requests. It does not read email. No submitted reports are stored in this repository or uploaded to the website.

## GitHub Pages

Enable Pages from the default branch, root directory. `index.html` is the tool directory; `ctr-renamer.html` is the self-contained application.

## Third-party software

The renamer embeds pdf-lib and JSZip. Their license notices are retained in the application bundle. This repository contains the utility only, not completed reports or the incident template.
