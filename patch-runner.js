const fs = require('fs');
const file = '/Users/mike/Documents/AIFactory/Code/components/forms/form-runner.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add layoutMode
code = code.replace(
  `const preset = themePresets[form.theme];`,
  `const preset = themePresets[form.theme];\n  const layoutMode = form.schema_json.layout || "single";`
);

// 2. Add validateAllFields
code = code.replace(
  `  function validateCurrentField() {`,
  `  function validateAllFields() {
    for (const field of fields) {
      if (field.required && isAnswerEmpty(answers[field.key])) {
        toast.error(
          t("field_required_message", {
            label: field.label,
          })
        );
        return false;
      }
    }
    return true;
  }

  function validateCurrentField() {`
);

// 3. Extract renderInput
const renderInputStart = `              {(currentField.type === "text" ||`;
const renderInputEnd = `              <div
                className={cn(
                  "rounded-[1.4rem] border border-dashed px-4 py-3 text-sm",
                  preset.surface
                )}
              >
                <p className={cn("leading-6", preset.subtleText)}>
                  {isLastQuestion ? t("review_before_submit") : t("billing_tip")}
                </p>
              </div>`;

const renderInputLogic = `  function renderFieldInput(field: FormFieldSchema, isLast: boolean, isLongMode: boolean = false) {
    const currentAnswer = answers[field.key];
    const currentFilesItem = files.filter((item) => item.field_key === field.key);

    return (
      <div className="space-y-4">
        <p className={cn("text-sm leading-6", preset.subtleText)}>
          {isLast ? t("final_question_hint") : t("question_focus_hint")}
        </p>
        {(field.type === "text" ||
          field.type === "email" ||
          field.type === "date" ||
          field.type === "number") && (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={String(currentAnswer || "")}
            onChange={(event) =>
              updateAnswer(
                field.key,
                field.type === "number"
                  ? event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                  : event.target.value
              )
            }
            className={cn(
              "h-16 rounded-[1.4rem] border px-5 text-lg shadow-none transition-colors placeholder:text-current/35 focus-visible:ring-0",
              preset.surfaceMuted
            )}
          />
        )}

        {field.type === "textarea" && (
          <Textarea
            placeholder={field.placeholder}
            value={String(currentAnswer || "")}
            onChange={(event) =>
              updateAnswer(field.key, event.target.value)
            }
            className={cn(
              "min-h-44 rounded-[1.4rem] border px-5 py-4 text-lg shadow-none transition-colors placeholder:text-current/35 focus-visible:ring-0",
              preset.surfaceMuted
            )}
          />
        )}

        {field.type === "select" && (
          <select
            className={cn(
              "flex h-16 w-full rounded-[1.4rem] border px-5 text-lg transition-colors focus:outline-none",
              preset.surfaceMuted
            )}
            value={String(currentAnswer || "")}
            onChange={(event) =>
              updateAnswer(field.key, event.target.value)
            }
          >
            <option value="">
              {field.placeholder || t("theme_placeholder")}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {field.type === "radio" && (
          <div className="grid gap-3">
            {field.options?.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  updateAnswer(field.key, option.value);
                  if (!isLast && !isLongMode) {
                    window.setTimeout(() => {
                      setCurrentIndex((idx) => Math.min(idx + 1, fieldCount - 1));
                    }, 180);
                  }
                }}
                className={cn(
                  "rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5",
                  currentAnswer === option.value
                    ? preset.surfaceActive
                    : preset.surface
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                        currentAnswer === option.value
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-current/15"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{option.label}</p>
                      <p
                        className={cn(
                          "mt-1 text-sm",
                          currentAnswer === option.value
                            ? preset.surfaceActiveText
                            : preset.subtleText
                        )}
                      >
                        {t("tap_to_continue")}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "size-5 rounded-full border",
                      currentAnswer === option.value
                        ? "border-white bg-white/25"
                        : "border-current/25"
                    )}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {field.type === "checkbox" && (
          <div className="grid gap-3">
            {field.options?.map((option, index) => {
              const answerValue = answers[field.key];
              const currentValues = Array.isArray(answerValue)
                ? answerValue.map((item) => String(item))
                : [];
              const checked = currentValues.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-4 rounded-[1.35rem] border px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer",
                    checked ? preset.surfaceActive : preset.surface
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      handleCheckboxChange(
                        field.key,
                        option.value,
                        event.target.checked
                      )
                    }
                    className="size-4 hidden"
                  />
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 items-center justify-center rounded-full border text-xs font-semibold shrink-0",
                        checked
                          ? "border-white/40 bg-white/15 text-white"
                          : "border-current/15"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{option.label}</p>
                      <p
                        className={cn(
                          "mt-1 text-sm",
                          checked ? preset.surfaceActiveText : preset.subtleText
                        )}
                      >
                        {checked ? t("selected") : t("tap_to_select")}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {(field.type === "file" ||
          field.type === "image" ||
          field.type === "pdf") && (
          <div className="space-y-3">
            <Input
              type="file"
              accept={
                field.type === "image"
                  ? "image/*"
                  : field.type === "pdf"
                    ? "application/pdf"
                    : undefined
              }
              onChange={(event) =>
                updateFileValue(field.key, event.target.files)
              }
              className={cn(
                "h-16 rounded-[1.4rem] border px-4 shadow-none pt-4",
                preset.surfaceMuted
              )}
            />
            <p className={cn("text-xs leading-6", preset.subtleText)}>
              {t("file_submit_tip")}
            </p>
            {currentFilesItem.length > 0 && (
              <div
                className={cn(
                  "rounded-[1.2rem] border px-4 py-3 text-sm",
                  preset.surface
                )}
              >
                {currentFilesItem.map((f) => f.file_name).join(", ")}
              </div>
            )}
          </div>
        )}
        
        {isLast && !isLongMode && (
          <div
            className={cn(
              "rounded-[1.4rem] border border-dashed px-4 py-3 text-sm mt-4",
              preset.surface
            )}
          >
            <p className={cn("leading-6", preset.subtleText)}>
              {t("review_before_submit")}
            </p>
          </div>
        )}
      </div>
    );
  }
`;

code = code.replace(`  const currentFiles = useMemo(() => {`, renderInputLogic + `\n\n  const currentFiles = useMemo(() => {`);

// 4. Replace the old render input logic with function call
// Find from <p className={cn("text-sm leading-6", preset.subtleText)}> to the end of review_before_submit div
const regexReplace = /<p className=\{cn\("text-sm leading-6", preset\.subtleText\)\}>[\s\S]*?\{isLastQuestion \? t\("review_before_submit"\) : t\("billing_tip"\)\}\n\s*<\/p>\n\s*<\/div>/m;
code = code.replace(regexReplace, `{renderFieldInput(currentField, isLastQuestion, false)}`);

// 5. Wrap the single mode return with layoutMode check, and add long mode return
const returnSingleStart = `  return (\n    <div className={cn("relative overflow-hidden rounded-[2rem] border px-4 py-4 md:px-5 md:py-5", preset.shell)}>`;

const returnLong = `  if (layoutMode === "long") {
    return (
      <div className={cn("relative overflow-hidden rounded-[2rem] border px-4 py-6 md:px-6 md:py-8 space-y-8", preset.shell)}>
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.panelGlow)} />
        <div className={cn("pointer-events-none absolute inset-0 opacity-100", preset.heroGlow)} />
        
        <div className="relative space-y-8">
          {fields.map((field, index) => (
            <div key={field.key} className={cn("rounded-[1.75rem] border p-5 md:p-6", preset.panel)}>
              <div className="flex items-center gap-3 mb-5">
                <div className={cn("inline-flex items-center justify-center size-8 rounded-full border text-sm font-bold", preset.eyebrow)}>
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold md:text-2xl">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-500">*</span>}
                </h2>
              </div>
              {renderHelp(field, preset)}
              <div className="mt-5">
                {renderFieldInput(field, index === fields.length - 1, true)}
              </div>
            </div>
          ))}

          <div className={cn("rounded-[1.75rem] border p-5 md:p-6 text-center", preset.panel)}>
            <p className={cn("text-sm mb-4", preset.subtleText)}>
              {t("review_before_submit")}
            </p>
            <Button
              type="button"
              onClick={() => {
                if (!validateAllFields()) return;
                handleSubmit();
              }}
              disabled={isPending}
              className={cn(
                "h-14 w-full md:w-auto md:min-w-[200px] rounded-[1.3rem] border text-base font-semibold",
                preset.actionPrimary
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  {t("submit")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

`;

code = code.replace(returnSingleStart, returnLong + returnSingleStart);

// Remove advanceAfterSelection since it's now inlined
code = code.replace(/  function advanceAfterSelection[\s\S]*?}, 180\);\n  }\n/m, '');

fs.writeFileSync(file, code);
