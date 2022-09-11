import React from "react";

import copy from 'copy-to-clipboard';

export const useDocumentTitle = (title) => {
    const oldTitle = React.useMemo(() => document.title, []);
    React.useEffect(() => {
        document.title = `${title} - MURPH.PRO`;
        return () => document.title = oldTitle
    }, [title, oldTitle]);
};

export const useClipboard = () => {
    return React.useCallback(copy, []);
};
