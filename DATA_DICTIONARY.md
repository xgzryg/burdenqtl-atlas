# BurdenQTL Atlas field guide

Field definitions describe the registered analyses. Disease-specific thresholds, effect units and statistical methods are provided in the catalog and study documentation.

The browser uses **36 association fields** and adds `analysis_id` to filtered CSV/TSV exports, giving **37 columns**. Released per-analysis TSV downloads retain additional source fields and lead metadata. Their empty `causal_status` field is retained in the data files but omitted from browser controls, displayed columns and filtered exports. The separate compressed lead table contains lead identifiers, statistics and LD selection metadata.

## Variant identity and annotation

| Field | Definition |
|---|---|
| `variant_key` | Full allele-specific identifier: `chr:position:REF:ALT`. Use this key when joining variants. |
| `rsID` | dbSNP rs identifier matched by coordinate, REF and ALT. Missing identifiers do not remove a variant. |
| `chromosome` | Chromosome containing the variant. |
| `position` | Genomic position in the recorded genome build. Current aortic aneurysm data use GRCh38. |
| `REF` | Reference allele, also the allele used for country RAF in the current model. |
| `ALT` | Alternate allele. |
| `genome_build` | Genome assembly for the coordinates and alleles. |
| `gene` | Gene annotation supplied by the current study; an empty value is not annotated. |
| `credible_status` | Current ABF credible-set membership when supplied. Empty values display as Not labelled, not as a negative finding. |
| `causal_status` | Reserved empty field in the full data files; not displayed or used by the browser. |
| `annotation_status` | Status of the original rsID/coordinate/allele annotation match. |
| `dbSNP_build` | dbSNP annotation build recorded in the input; current annotations use build 151. |

## Association estimates

| Field | Definition |
|---|---|
| `beta_caf` | RAF main-effect estimate for a 0.01 increase in country REF allele frequency. The outcome is an age-standardized burden rate per 100,000. With uncentered RAF × SDI, this main effect is evaluated at SDI = 0. |
| `se_caf` | Reported equivalent standard error of `beta_caf`, in the same units; see the [statistical methods](downloads/S3C_P_value_transformation_disclosure.md) for its definition and derivation. |
| `p_value` | Reported P value for the RAF main effect, used for lead ranking and browser filtering. The [statistical methods](downloads/S3C_P_value_transformation_disclosure.md) describe the S3C transformation. |
| `neg_log10_p` | Original −log10(P) for the RAF main effect. It can preserve information when a numerical P value is extremely small. |
| `df` | Degrees of freedom used in the original effect test. |
| `ci_lower_caf` | Lower bound of the reported 95% interval for `beta_caf` in the current study summary. |
| `ci_upper_caf` | Upper bound of the reported 95% interval for `beta_caf` in the current study summary. |
| `beta_interaction_caf` | RAF × SDI interaction coefficient, scaled to a 0.01 increase in REF allele frequency per unit of SDI. |
| `p_interaction` | P value for the RAF × SDI interaction. It does not replace the main-effect P value used to select this association collection. |
| `sdi_center` | SDI centering constant used by the fitted model. All associations have value 0. |
| `beta_at_mean_sdi_caf` | Combined RAF effect evaluated at the model data's mean SDI, per 0.01 increase in REF frequency. This differs from the uncentered RAF main effect. |
| `se_at_mean_sdi_caf` | Original standard error of the combined effect at mean SDI, including covariance between model coefficients. |

## Allele frequencies and direction

| Field | Definition |
|---|---|
| `effect_allele` | Allele whose country frequency defines the reported effect. It is REF in the current aortic aneurysm data. |
| `other_allele` | The other modeled allele; ALT in the current aortic aneurysm data. |
| `REF_AF_20country_pooled` | Pooled REF frequency calculated from REF allele counts divided by called allele counts across the 20 countries. It is not a simple average of country frequencies. |
| `ALT_AF_20country_pooled` | Corresponding pooled ALT allele frequency. |
| `MAF` | Minimum of the pooled REF and ALT frequencies. MAF does not replace country REF frequency in the bQTL model. |

The released analysis table additionally retains PLINK allele coding: `A1=ALT`, `A2=REF`. Those columns do not define the direction of `beta_caf`. The country-frequency view uses REF frequency as a proportion between 0 and 1.

## Study groups and lead membership

| Field | Definition |
|---|---|
| `sex` | Analysis sex stratum: Both, Male, or Female in this release. |
| `measure` | Burden measure; Deaths and DALYs are available for the current aortic aneurysm resource. All paired burden outcomes are age-standardized rates. |
| `status` | Original model fitting status. The imported association collection contains records with status `ok`; nonconverged records were excluded upstream. |
| `n_rows` | Number of country-year observations used by the model. This is not the number of individual GWAS participants. |
| `n_countries` | Number of countries represented in the model data. |
| `is_lead` | Exact membership in the supplied sex-by-measure reference LD lead set. True identifies a lead; false identifies an association not selected as a lead. Changing browser filters does not rerun LD selection. |
| `rank_lead` | Rank within the source sex-by-measure lead set, ordered by P value and variant key; null for non-lead associations. Browser filters do not recalculate this source rank. |

The Results selectors independently choose disease, burden measure and sex. All measures and All sex strata combine matching analyses; exported `measure`, `sex` and `analysis_id` still identify each individual source analysis. The combined view does not replace these values with an All category or merge repeated SNP records.

Per-analysis downloads include additional association statistics and source metadata. The browser field guide focuses on the fields used for searching, filtering and interpreting the displayed results.

## Missing values and scientific status

Browser data use JSON `null` for missing values. Missing gene or credible labels mean no annotation is supplied for that association. Reported zero P values are retained in data tables and omitted from log-scale plots.

The current aortic aneurysm collection contains 273,285 associations with P < 1e-5 across 6 measure-by-sex groups. The default view uses P < 1e-5 and All SNPs. Lead selection starts at P < 8e-9 and uses two-stage LD filtering within ±500 kb at r² > 0.6 and r² > 0.1. Lead membership does not change when browser filters change. Association counts are variant-by-group records; distinct SNP counts use the full allele-specific variant key.

The disease burden dataset additionally contains country, sex, measure, year, `val`, `lower`, and `upper`. Here `lower` and `upper` are the GBD uncertainty interval bounds; they are not the confidence interval of `beta_caf`. Country Pearson correlations shown for a selected year are descriptive and are not the fitted bQTL model effect.

## Statistical methods and access

The [statistical methods](downloads/S3C_P_value_transformation_disclosure.md) document the supplied P values, equivalent standard errors and intervals, and their use in downstream analyses.

The website is publicly accessible online. The research analysis code is available from the corresponding author upon reasonable request.
