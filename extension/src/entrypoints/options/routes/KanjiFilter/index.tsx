import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/cn";
import { NotFoundRule } from "../../components/NotFoundRule";
import { KanjiFilterDashboard } from "./components/KanjiFilterDashboard";
import { KanjiFilterItem } from "./components/KanjiFilterItem";
import { useKanjiFiltersStore } from "./store";

const PAGE_SIZE = 100;

export function KanjiFilter() {
  const kanjiFilters = useKanjiFiltersStore((state) => state.kanjiFilters);

  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [matchAllOnly, setMatchAllOnly] = useState(false);
  const [page, setPage] = useState(1);
  const filteredRules = useMemo(() => {
    const search = query.trim();
    return kanjiFilters.filter(
      (rule) =>
        !(matchAllOnly && rule.yomikatas) &&
        (!search ||
          rule.kanji.includes(search) ||
          rule.yomikatas?.some((reading) => reading.includes(search))),
    );
  }, [kanjiFilters, query, matchAllOnly]);
  const pageCount = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  if (page !== currentPage) {
    setPage(currentPage);
  }
  const offset = (currentPage - 1) * PAGE_SIZE;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center lg:max-w-5xl lg:px-8",
        "playwright-kanji-filter-page",
      )}
    >
      <KanjiFilterDashboard className="mb-5" disableExportAndClear={kanjiFilters.length === 0} />
      <div className="mb-5 flex w-full flex-wrap items-center gap-3">
        <input
          type="search"
          aria-label={t("kanjiFilterSearch")}
          placeholder={t("kanjiFilterSearch")}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          className="min-w-0 flex-1 rounded-md border-slate-300 bg-transparent dark:border-slate-600"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={matchAllOnly}
            onChange={(event) => {
              setMatchAllOnly(event.target.checked);
              setPage(1);
            }}
          />
          {t("kanjiFilterMatchAllOnly")}
        </label>
      </div>
      <nav aria-label={t("kanjiFilterPagination")} className="mb-5 flex items-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
          className="rounded-md px-3 py-2 hover:bg-slate-500/10 disabled:opacity-40"
        >
          {t("kanjiFilterPrevious")}
        </button>
        <output>
          {t("kanjiFilterPage", {
            page: currentPage,
            pages: pageCount,
            total: filteredRules.length,
          })}
        </output>
        <button
          disabled={currentPage === pageCount}
          onClick={() => setPage(currentPage + 1)}
          className="rounded-md px-3 py-2 hover:bg-slate-500/10 disabled:opacity-40"
        >
          {t("kanjiFilterNext")}
        </button>
      </nav>
      {filteredRules.length > 0 ? (
        <div className="grid grid-cols-2 flex-wrap gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {filteredRules.slice(offset, offset + PAGE_SIZE).map((rule, index) => (
            <KanjiFilterItem key={rule.kanji} rule={rule} index={offset + index} />
          ))}
        </div>
      ) : kanjiFilters.length > 0 ? (
        <output>{t("kanjiFilterNoResults")}</output>
      ) : (
        <NotFoundRule />
      )}
    </div>
  );
}
