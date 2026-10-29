# OEMTools

Utilities for emergency-management workflows.

## CTR File Renamer

Open **CTR Tools** (`ctr-renamer.html`) in Chrome or Edge and select **Rename CTRs**.

1. Add completed fillable CTR PDFs.
2. Review employee names and work dates.
3. Choose an export folder and allow browser access.
4. Select **Export all PDFs** to save each report separately.

Files follow `Employee_or_Crew_CTR_YYYY-MM-DD_to_YYYY-MM-DD.pdf`.
Two-digit years mean 2000–2099. One work date produces a single-date filename.
Multiple employees require a crew/group name. Missing fields and scanned or flattened PDFs require manual entries.
Existing export filenames receive numbered suffixes. PDF contents remain byte-identical; source files are unchanged.

The utility runs entirely in the browser without accounts or network requests. It does not read email. No submitted reports are stored in this repository or uploaded to the website.

## CTR Duplicate Checker

Open **CTR Tools** from the OEMTools home page and select **Check duplicates**. This tab checks your full filed folder independently of renaming batches. Format incoming reports with the renamer, add them to the filed folder, then scan that folder for duplicates.

1. Select **Choose folder and check duplicates** in Chrome or Edge.
2. Choose the folder containing formatted CTR PDFs. Only that folder is scanned, not subfolders.
3. Review groups with the same employee/crew name and exact work dates. Numbered export/download suffixes are ignored; capitalization and spaces/underscores are normalized.
4. Choose the copy to **Keep**. Open the PDFs and check **Confirmed duplicate — remove** only for files you have reviewed. Identical contents are labeled; different contents require review because they may be corrected reports.
5. Select **Remove confirmed duplicates** and confirm the listed removals. Removal is permanent. At least one copy per group is retained.

Nothing is selected for removal by default. Unrecognized filenames and unreadable groups are skipped. Before each deletion, both the retained and removed PDF are re-read; changed or missing files block that removal. Scan again after cleanup.

Run the focused checks with `node test-ctr.cjs`.

## GitHub Pages

Enable Pages from the default branch, root directory. `index.html` is the tool directory; `ctr-renamer.html` contains both tools in separate tabs. Old `ctr-duplicates.html` links redirect to the duplicate checker tab.

## Third-party software

The renamer embeds pdf-lib and JSZip. Their license notices are retained in the application bundle. This repository contains the utility only, not completed reports or the incident template.
