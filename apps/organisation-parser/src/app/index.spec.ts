import { Resolver } from "@h-hub/common"
import { Organisation, RawOrganisation } from "@h-hub/models";
import { getOrganisation, OrgParserProps } from "./index";

const ORGANISATION: RawOrganisation = {
    head: {
        actualized: "a",
        headline1: "b",
        headline2: "c",
        live: 1,
        name: "d",
        repURL: "e",
        sname: "f",
    },
    menu: {
        dt: {
            list: {},
            selected: "1",
        },
        org: {
            list: {
                "1": "x",
                "2": "y",
                "3": "z",
            },
            selectedID: "2",
        },
        period: {
            list: {},
            selectedID: "3",
        },
    },
    content: {
        classes: [],
    },
}

jest.mock("@h-hub/common", () => {
    class MockRawOrganisationResolver implements Resolver<RawOrganisation> {
        async resolve(): Promise<RawOrganisation> {
            return ORGANISATION
        }
    }

    return {
        ...jest.requireActual("@h-hub/common"),
        RawOrganisationResolver: MockRawOrganisationResolver,
    }
})

describe("Organisation parser", () => {

    test("No orgId", () => {
        const props: OrgParserProps = {
            id: ORGANISATION.menu.org.selectedID,
        }

        const org: Organisation = {
            id: ORGANISATION.menu.org.selectedID,
            name: ORGANISATION.head.name,
            shortName: ORGANISATION.head.sname,
            seasonIds: new Set(),
            leagueIds: new Set(),
            subOrgIds: new Set(Object.keys(ORGANISATION.menu.org.list)),
        }
        return expect(getOrganisation(props)).resolves.toEqual(org)
    })

    test("OrgId", () => {
        const props: OrgParserProps = {
            id: ORGANISATION.menu.org.selectedID,
            orgId: "123",
        }

        const org: Organisation = {
            id: ORGANISATION.menu.org.selectedID,
            name: ORGANISATION.head.name,
            shortName: ORGANISATION.head.sname,
            seasonIds: new Set(),
            leagueIds: new Set(),
            subOrgIds: new Set(Object.keys(ORGANISATION.menu.org.list)),
            orgId: props.orgId,
        }
        return expect(getOrganisation(props)).resolves.toEqual(org)
    })

    test("SubOrgIds", () => {
        const props: OrgParserProps = {
            id: ORGANISATION.menu.org.selectedID,
            subOrgIds: ["42"],
        }

        const org: Organisation = {
            id: ORGANISATION.menu.org.selectedID,
            name: ORGANISATION.head.name,
            shortName: ORGANISATION.head.sname,
            seasonIds: new Set(),
            leagueIds: new Set(),
            subOrgIds: new Set(props.subOrgIds),
        }
        return expect(getOrganisation(props)).resolves.toEqual(org)
    })
})