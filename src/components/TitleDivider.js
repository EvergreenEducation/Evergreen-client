import React from 'react';

function TitleDivider(props) {
    const title = props.title;
    return (
        <div class="line-title">
            <div></div>
            <span>{title}</span>
            <div></div>
        </div>
    );
}

export default TitleDivider;