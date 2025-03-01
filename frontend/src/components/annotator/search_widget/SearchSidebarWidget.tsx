import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Header, Segment, Icon, Message, Form } from "semantic-ui-react";
import _ from "lodash";
import { AnnotationStore } from "../context";
import "./SearchWidgetStyles.css";
import { TextSearchSpanResult, TextSearchTokenResult } from "../../types";
import { TruncatedText } from "../../widgets/data-display/TruncatedText";

const PageHeader: React.FC<{
  result: TextSearchTokenResult | TextSearchSpanResult;
}> = ({ result }) => {
  if ("start_page" in result && "end_page" in result) {
    // TextSearchTokenResult
    return result.start_page === result.end_page ? (
      <Header size="small">Page {result.end_page}</Header>
    ) : (
      <Header size="small">
        Page {result.start_page} to Page {result.end_page}
      </Header>
    );
  } else {
    // TextSearchSpanResult
    return <Header size="small">Text Match</Header>;
  }
};

const PlaceholderSearchResultCard: React.FC = () => (
  <Message warning>
    <Message.Header>No Matching Results</Message.Header>
    <p>
      Try changing your query. Also be aware that OCR quality issues may cause
      slight changes to the characters in the PDF text layer.
    </p>
  </Message>
);

const SearchResultCard: React.FC<{
  index: number;
  onResultClick: (index: number) => void;
  res: TextSearchTokenResult | TextSearchSpanResult;
  totalMatches: number;
}> = ({ index, res, totalMatches, onResultClick }) => {
  const isTokenResult = "tokens" in res;

  return (
    <Message
      key={index}
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        marginRight: ".5vw",
      }}
      onClick={() => {
        console.log("Clicked on result", index);
        onResultClick(index);
      }}
      className="hover-effect"
    >
      <Message.Header>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageHeader result={res} />
          <Header size="tiny" style={{ margin: 0 }}>
            {index + 1} of {totalMatches}
          </Header>
        </div>
      </Message.Header>
      <Message.Content>
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f8f8f8",
            borderRadius: "5px",
            fontSize: "0.9em",
            lineHeight: "1.4",
          }}
        >
          {isTokenResult ? (
            res.fullContext
          ) : (
            <TruncatedText text={res.text} limit={64} />
          )}
        </div>
      </Message.Content>
    </Message>
  );
};

export const SearchSidebarWidget: React.FC = () => {
  const annotationStore = useContext(AnnotationStore);
  const {
    textSearchMatches,
    searchForText,
    searchText,
    selectedTextSearchMatchIndex,
  } = annotationStore;

  const debouncedExportSearch = useCallback(
    _.debounce((searchTerm: string) => {
      searchForText(searchTerm);
    }, 300),
    [searchForText]
  );

  const handleDocSearchChange = (value: string) => {
    searchForText(value);
    debouncedExportSearch(value);
  };

  const clearSearch = () => {
    searchForText("");
  };

  useEffect(() => {
    console.log(
      "Selected text search match index",
      selectedTextSearchMatchIndex
    );
    console.log(
      "Search result element refs",
      annotationStore?.searchResultElementRefs?.current
    );
    if (
      annotationStore.searchResultElementRefs?.current[
        selectedTextSearchMatchIndex
      ]
    ) {
      console.log(
        "Scrolling to result",
        selectedTextSearchMatchIndex,
        annotationStore.searchResultElementRefs.current[
          selectedTextSearchMatchIndex
        ]
      );
      annotationStore.searchResultElementRefs.current[
        selectedTextSearchMatchIndex
      ]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedTextSearchMatchIndex, annotationStore.searchResultElementRefs]);

  const onResultClick = (index: number) => {
    annotationStore.setSelectedTextSearchMatchIndex(index);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Segment
        secondary
        attached
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          flex: "unset",
          WebkitBoxFlex: "unset",
        }}
      >
        <Form>
          <Form.Input
            iconPosition="left"
            icon={
              <Icon
                name={searchText ? "cancel" : "search"}
                link
                onClick={searchText ? clearSearch : undefined}
                style={{ color: searchText ? "#db2828" : "#2185d0" }}
              />
            }
            placeholder="Search document..."
            onChange={(e) => handleDocSearchChange(e.target.value)}
            value={searchText}
            style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          />
        </Form>
      </Segment>
      <Segment
        style={{
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          border: "none",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
        }}
        attached="bottom"
      >
        <div style={{ overflowY: "auto", height: "100%" }}>
          {textSearchMatches.length > 0 ? (
            textSearchMatches.map((res, index) => (
              <SearchResultCard
                key={`SearchResultCard_${index}`}
                index={index}
                totalMatches={textSearchMatches.length}
                res={res}
                onResultClick={onResultClick}
              />
            ))
          ) : (
            <PlaceholderSearchResultCard />
          )}
        </div>
      </Segment>
    </div>
  );
};
