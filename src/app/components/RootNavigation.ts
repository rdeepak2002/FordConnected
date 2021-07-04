import * as React from 'react';

export const navigationRef: any = React.createRef();

export function navigateRoot(name) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name: name}],
  });
}
