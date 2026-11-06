# BurdenQTL Atlas user guide

BurdenQTL Atlas is a cross-disease resource for burden quantitative trait loci. It brings together genetic associations, mapped genes and functional evidence for population-level disease burden.

Visit [BurdenQTL Atlas](https://xgzryg.github.io/burdenqtl-atlas/) to browse the available disease resources. Each disease has its own analyses, annotations and study documentation.

## Current disease resource

The current aortic aneurysm resource covers 20 countries, two burden measures (Deaths and DALYs) and three sex strata (Both, Male and Female). Burden data use GBD2023 for 1990–2023; variant coordinates use GRCh38.

## Search results

1. Open **Results** and choose **Disease**, **Disease burden measure** and **Sex** independently. Choose **All measures** or **All sex strata** to compare the corresponding analyses.
2. Search by rsID, full variant ID or chromosome interval. Separate multiple variant IDs with semicolons. Chromosome, position and effect-size filters can refine the search.
3. Choose a P-value threshold: **1e-5**, **5e-6**, **5e-8**, **1e-8**, or **8e-9**. **Custom…** accepts another threshold. Results use the strict rule **P < threshold**.
4. Use **SNP set** to select **All SNPs**, **Lead SNPs**, or **Non-lead SNPs**. The default is All SNPs with P < 1e-5. Lead selection starts at P < 8e-9, followed by two-stage LD filtering within ±500 kb at r² > 0.6 and r² > 0.1. Lead status records the resulting study lead set; changing a display threshold does not assign new lead status.

The searchable collection contains all eligible associations with P < 1e-5, including non-lead SNPs. A more permissive threshold cannot add records outside this collection. Association counts represent SNP-by-analysis records; a distinct SNP may occur in more than one analysis.

## Explore and download

Sort the table by a column heading, choose displayed columns or open a variant to view its statistics, results across analyses and country allele frequencies. The plots show the selected association collection. Country views compare allele frequencies with burden rates for the chosen year.

**Export TSV** and **CSV** include every matching result, including rows beyond the current page. The **Downloads** page provides analysis tables, the selected lead SNP table and supporting data. The [statistical methods](downloads/S3C_P_value_transformation_disclosure.md) accompany the data package.

## Common fields

| Field | Meaning |
|---|---|
| SNP ID | Allele-specific identifier in the form chromosome:position:REF:ALT. |
| rsID | Variant identifier used by dbSNP, when available. |
| REF / ALT | Reference and alternate alleles. |
| βCAF | Reported burden-rate effect per 0.01 increase in country REF allele frequency, evaluated at the model's reference condition. |
| SE | Reported equivalent standard error; see the statistical methods for its definition. |
| P value | P value for the reported association. |
| Lead SNP | Whether the association belongs to the study's selected lead set. |
| REF AF | Reference allele frequency, expressed as a proportion from 0 to 1. |

Burden measures are age-standardized rates per 100,000. Available gene and credible-set annotations are retained; empty credible-set labels display as Not labelled. See the [field guide](DATA_DICTIONARY.md) for detailed definitions and interpretation.

## Website and offline access

The package contains 6 analyses, 273,285 association records (P < 1e-5), 112,580 distinct variants and 5,124 lead association records. Disease availability and analysis counts are listed on the website.

For an offline copy, serve the downloaded website directory with a static web server:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

While that command is running, open `http://127.0.0.1:8766/index.html` in Edge or Chrome. Stop the service with Ctrl+C. External Ensembl, dbSNP and hosted attachment links require an internet connection.

## Statistical methods and access

The [statistical methods](downloads/S3C_P_value_transformation_disclosure.md) define the S3C P values and equivalent standard errors and intervals.

The website is publicly accessible online. The research analysis code is available from the corresponding author upon reasonable request.
