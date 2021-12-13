import { stderr, stdout } from 'process';
import * as vscode from 'vscode';


export class BravetoolsUnitsProvider implements vscode.TreeDataProvider<BraveUnitTreeItem> {
    constructor() {}

    getTreeItem(element: BraveUnitTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: BraveUnitTreeItem): Thenable<BraveUnitTreeItem[]> {

        // if (element) {
            return Promise.resolve(this.getBraveUnits());
        // }


        return Promise.resolve([]);

    }

    private getBraveUnits(): BraveUnitTreeItem[]{

        let output: string;
        output = '';
        const c = require("child_process");

        let units: BraveUnit[];
        c.exec('brave units --out json', (err:string, stdout:string, stderr:string) => {
            output = stdout.toString();

            units = JSON.parse(output);
            
            const toBraveUnitTreeItem = (unitName: string): BraveUnitTreeItem => {
                return new BraveUnitTreeItem(unitName, vscode.TreeItemCollapsibleState.Collapsed);
            };

            console.log('units: ' + units);

            const braveUnitsTreeItems = units 
                ? Object.keys(units).map(u => toBraveUnitTreeItem(u))
                : [];

            console.log('treeItems: ' + braveUnitsTreeItems);

                return braveUnitsTreeItems;

        });

        return  [];
    }
}

class BraveUnitTreeItem extends vscode.TreeItem {
    constructor(
        public label: string,
        public readonly collapsibleState:vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}

interface BraveUnit {
    name: string;
    status: string;
    address: string;
    disk: Volume[];
    proxy: Port[];
    nic: Network[];
}

interface Volume {
    name: string;
    path: string;
    source: string;
}

interface Port {
    name: string;
    connectIp: string;
    listenIp: string;
}

interface Network {
    name: string;
    type: string;
    nicType: string;
    parent: string;
    ip: string;
}

