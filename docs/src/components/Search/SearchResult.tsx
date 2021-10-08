import React from 'react';

type SearchResultProps = {
    index: number;
    highlightedIndex: number;
    keyword: string;
    title: string;
    isKeywordNotFound?: boolean;
};

const SearchResult = (props: SearchResultProps) => { 
    const searchResultContent = props.title + '...';
    const searchResultCss = (!props.isKeywordNotFound ? 'textContainer ' : '') + 
        (props.index === props.highlightedIndex ? 'active' : '');
    return (
        <div
            className={searchResultCss}
            data-testid="search-result"
        >
            <p className="title"
                dangerouslySetInnerHTML = {{ __html: props.keyword }}
            ></p>
            <p
                className="footer"
                dangerouslySetInnerHTML={{ __html: searchResultContent }}
            ></p>
        </div>
    )
};

export default SearchResult;
