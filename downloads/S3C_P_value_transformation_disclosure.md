# Additional methods: S3C P values and t-equivalent uncertainty in the aortic aneurysm bQTL analysis

This standalone document specifies the P-value transformation and main-effect uncertainty used in the aortic aneurysm bQTL results. The study combines GBD 2023 age-standardized mortality and DALY rates for 1990–2023 with 1000 Genomes reference-allele frequencies across 20 countries. The six analyses comprise mortality and DALYs in both sexes combined, males and females.

## Scope of the reported statistics

The supplied full-sample summaries contain S3C-transformed main-effect P values. These values are used for association screening, Manhattan plots, lead selection and the bQTL inputs to regional comparisons with the external aortic aneurysm GWAS. The discovery cutoff is strictly P < 8×10⁻⁹. The separate query collection uses P < 10⁻⁵.

Country-exclusion sensitivity analyses apply the same fixed sex- and outcome-specific transformation to the original P value from each exclusion fit. The reported uncertainty is then calculated from the assigned P value, coefficient and degrees of freedom. Agreement between these quantities under the t formula is algebraic; it does not make the reported P values identical to the untransformed mixed-model test probabilities.

## Underlying model and S3C calculation

The underlying mixed model includes country reference-allele frequency, the Socio-demographic Index (SDI), their interaction and genetic principal components 1–4, with crossed random intercepts for country and year. Model fitting uses maximum likelihood, and the original two-sided test of the reference-frequency coefficient uses Satterthwaite degrees of freedom. Coefficients and model standard errors are multiplied by 0.01 to express effects per one-percentage-point increase in reference-allele frequency.

Let P_model denote the original model P value and F₁ the cumulative distribution function of a chi-square variable with one degree of freedom. The retained S3C specification is:

```text
X_model = F₁⁻¹(1 − P_model)
lambda_g = median(X_model) / F₁⁻¹(0.5)
lambda_target = 3.218
c_g = lambda_g / lambda_target
X_S3C = X_model / c_g
P_S3C = 1 − F₁(X_S3C)
       = erfc(sqrt(X_model / (2 × c_g)))
```

Here, lambda_g is the retained value for the corresponding original full-summary group. The common target of 3.218 was selected after comparison of earlier scaling scenarios. The conversion starts from the model P value, rather than directly treating the squared Satterthwaite t statistic as a one-degree-of-freedom chi-square statistic.

The same retained group factor is used for every country exclusion. Neither lambda_g nor c_g is re-estimated from the selected variants or from a reduced-country fit. Calculations start from the saved original model P value, so applying the procedure again does not accumulate the transformation.

## Fixed group parameters

| Sex | Outcome | Retained lambda_g | Common target | c_g |
|---|---|---:|---:|---:|
| Both | Deaths | 4.889798441337299 | 3.218 | 1.519514742491392 |
| Both | DALYs | 5.100521288343921 | 3.218 | 1.584997292835277 |
| Male | Deaths | 4.783181356073522 | 3.218 | 1.4863832678910882 |
| Male | DALYs | 5.3291626871253195 | 3.218 | 1.6560480693366437 |
| Female | Deaths | 4.055110354849767 | 3.218 | 1.2601337336388339 |
| Female | DALYs | 4.5657677201528575 | 3.218 | 1.4188215413775194 |

All six factors exceed one. Dividing X_model by these factors therefore increases the eligible P values relative to their original model values. S3C is an exploratory post-fit transformation; the selected target is not an independently validated calibration of type-I error or confounding.

## Equivalent standard errors and intervals

The current full-sample summaries supplied on 20 October 2026 contain revised main-effect standard errors and interval endpoints. For a coefficient βCAF, Satterthwaite degrees of freedom ν and the assigned P_S3C, the rule is:

```text
t_equivalent = qt(P_S3C / 2, df = ν, lower.tail = FALSE)
SE_equivalent = abs(βCAF) / t_equivalent
interval_equivalent = βCAF ± qt(0.975, df = ν) × SE_equivalent
```

The implementation evaluates the upper-tail quantile using log(P_S3C) − log(2), avoiding cancellation in 1 − P_S3C/2. This is a record-specific t-distribution conversion, not multiplication of all model standard errors by a common constant.

This uncertainty step retains the coefficient, degrees of freedom and assigned P value. It does not change interaction statistics, the effect and standard error evaluated at mean SDI, sample sizes or fit status. The interval uses the conventional 95% t-interval formula, but its frequentist coverage after the P-value transformation has not been independently established. The equivalent SE is not a new estimate of the model's sampling uncertainty.

## Full-sample baselines and country-exclusion comparisons

The five leading variants in each of the six outcome–sex analyses define 30 sensitivity targets. Their full-sample baseline β, SE, P and interval values are extracted directly from the current supplied summaries by sex, outcome and complete chromosome:position:REF:ALT identity. These baselines are not refitted or transformed a second time, and original model uncertainty is not reconstructed from their supplied S3C values.

Each target has 20 country-exclusion fits, giving 600 evaluable comparisons. Each exclusion removes one country and all 34 annual observations, leaving 646 observations from 19 countries. The model terms, remaining reference frequencies and principal-component coordinates are retained.

The existing 600 exclusion fits are reused. Their saved original model P values receive the fixed group-specific S3C conversion; their main-effect SEs and intervals then receive the t-equivalent conversion above. These are post-fit calculations and do not rerun the exclusion models. Original model P values and original model SEs and intervals remain separately retained in the analysis records.

All 600 comparisons preserve coefficient direction. At P < 8×10⁻⁹, 571 comparisons meet the threshold on the S3C scale, compared with 590 using the saved untransformed model P values. Coefficient changes and percentage coefficient changes are unaffected because the coefficients are unchanged. External-frequency replacement was not run because replacement inputs were unavailable.

## Downstream analyses and interpretation

GO, Reactome and KEGG enrichment-test P values and their BH adjustments, GBD burden-trend tests, external GWAS source P values and the tests of regional correlations are not themselves subjected to S3C. Regional comparisons use the S3C bQTL P patterns as one input and the unchanged external GWAS P patterns as the other.

The SE-only input revision leaves the P values, eligible variants, 23,310 significant associations and 5,124 lead associations unchanged. It therefore does not change lead selection or the external regional P-pattern comparisons.

Approximate Bayes factors (ABFs), posterior inclusion probabilities (PIPs), maximum-PIP candidates and 99% credible sets have been recomputed using the current equivalent SEs, with the existing coefficients, priors and LD-defined candidate sets. Across 5,124 outcome–sex–lead regions, the maximum PIP is 0.1676625580371216 and the median 99% credible-set size is 545.5 variants. Complete credible-set membership contains 2,895,810 region–variant records, and retaining all exact maximum-PIP ties gives 5,468 candidate records.

These posterior quantities describe conditional priorities under the supplied variances and single-causal-variant assumption. They remain exploratory and do not establish independently calibrated causal probabilities or replicated association. Algebraic agreement among β, equivalent SE, degrees of freedom and transformed P does not by itself validate the S3C selection procedure.
