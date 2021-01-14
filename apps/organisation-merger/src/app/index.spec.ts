import { RawOrgProps } from "@h-hub/common"
import { Organisation } from "@h-hub/models"

import { getBaseOrganisations, getParentOrgs, getSubOrgs } from "./index"

const organisationA: Organisation = {
    id: "1",
    name: "A",
    shortName: "a",
    leagueIds: new Set(["1", "2", "3"]),
    seasonIds: new Set(["101", "102", "103"]),
}

const organisationB: Organisation = {
    id: "2",
    name: "B",
    shortName: "b",
    leagueIds: new Set(["4", "5", "6"]),
    seasonIds: new Set(["104", "105", "106"]),
}

const organisationC: Organisation = {
    id: "3",
    name: "C",
    shortName: "c",
    leagueIds: new Set(["7", "8", "9"]),
    seasonIds: new Set(["107", "108", "109"]),
}

const organisationD: Organisation = {
    id: "4",
    name: "D",
    shortName: "d",
    leagueIds: new Set(["10", "11", "12"]),
    seasonIds: new Set(["110", "111", "112"]),
}

function compareOrg(org1: RawOrgProps, org2: RawOrgProps): number {
    return org1.id.localeCompare(org2.id)
}

describe("getParentOrgs", () => {
    test("Empty list", () => {
        expect(getParentOrgs([])).toEqual([])
    })

    test("Finds same", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["105", "4", "1005"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["1006", "106", "4"])
        }

        const parentOrg: RawOrgProps = {
            id: "4"
        }

        expect(getParentOrgs([orgA, orgB, orgC])).toEqual([parentOrg])
    })

    test("Finds multiple", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["5", "4", "1005"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["6", "106", "1006"])
        }
        const orgD: Organisation = {
            ...organisationD,
            subOrgIds: new Set(["7", "107", "106"])
        }

        const parentOrg1: RawOrgProps = {
            id: "4"
        }
        const parentOrg2: RawOrgProps = {
            id: "106"
        }

        expect(getParentOrgs([orgA, orgB, orgC, orgD])).toEqual([parentOrg1, parentOrg2])
    })

    test("Finds no same", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["105", "5", "1005"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["1006", "106", "6"])
        }

        expect(getParentOrgs([orgA, orgB, orgC])).toEqual([])
    })

    test("Invalid", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "5"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["4", "5"])
        }

        expect(() => getParentOrgs([orgA, orgB])).toThrow()
    })

    test("Handles empty subOrgs", () => {
        expect(getSubOrgs([organisationA])).toEqual([])
    })
})

describe("getBaseOrganisations", () => {
    test("Empty list", () => {
        expect(getBaseOrganisations([])).toEqual([])
    })

    test("With parent", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["4"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["4"])
        }

        const baseErganisationA: Organisation = {
            ...orgA,
            orgId: "4",
        }
        const baseErganisationB: Organisation = {
            ...orgB,
            orgId: "4",
        }
        const baseErganisationC: Organisation = {
            ...orgC,
            orgId: "4",
        }

        expect(
            getBaseOrganisations([orgA, orgB, orgC]).sort(compareOrg)
        ).toEqual(
            [baseErganisationA, baseErganisationB, baseErganisationC].sort(compareOrg)
        )
    })

    test("With multiple parent", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["5"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["5"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["6"])
        }
        const orgD: Organisation = {
            ...organisationD,
            subOrgIds: new Set(["6"])
        }

        const baseErganisationA: Organisation = {
            ...orgA,
            orgId: "5",
        }
        const baseErganisationB: Organisation = {
            ...orgB,
            orgId: "5",
        }
        const baseErganisationC: Organisation = {
            ...orgC,
            orgId: "6",
        }
        const baseErganisationD: Organisation = {
            ...orgD,
            orgId: "6",
        }

        expect(
            getBaseOrganisations([orgA, orgB, orgC]).sort(compareOrg)
        ).toEqual(
            [baseErganisationA, baseErganisationB, baseErganisationC, baseErganisationD].sort(compareOrg)
        )
    })

    test("With wrong parent", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "5"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["4", "5"])
        }

        expect(() => getBaseOrganisations([orgA, orgB])).toThrow()
    })

    test("With subs", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["105", "5", "1005"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["1006", "106", "6"])
        }

        expect(
            getBaseOrganisations([orgA, orgB, orgC]).sort(compareOrg)
        ).toEqual(
            [orgA, orgB, orgC].sort(compareOrg)
        )
    })

    test("With parent and subs", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["105", "4", "1005"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["1006", "106", "4"])
        }

        const baseErganisationA: Organisation = {
            ...orgA,
            orgId: "4",
            subOrgIds: new Set(["104", "1004"]),
        }
        const baseErganisationB: Organisation = {
            ...orgB,
            orgId: "4",
            subOrgIds: new Set(["105", "1005"]),
        }
        const baseErganisationC: Organisation = {
            ...orgC,
            orgId: "4",
            subOrgIds: new Set(["106", "1006"]),
        }

        expect(
            getSubOrgs([orgA, orgB, orgC]).sort(compareOrg)
        ).toEqual(
            [baseErganisationA, baseErganisationB, baseErganisationC].sort(compareOrg)
        )
    })

    test("No parent and subs", () => {
        const orgA: Organisation = {
            ...organisationA,
        }
        const orgB: Organisation = {
            ...organisationB,
        }
        const orgC: Organisation = {
            ...organisationC,
        }

        expect(getBaseOrganisations([orgA, orgB, orgC])).toEqual([orgA, orgB, orgC])
    })

    test("Handles empty subOrgs", () => {
        expect(getSubOrgs([organisationA])).toEqual([organisationA])
    })
})

describe("getSubOrgs", () => {
    test("Empty list", () => {
        expect(getSubOrgs([])).toEqual([])
    })

    test("Finds different", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["105", "4", "1005"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["1006", "106", "4"])
        }

        const subOrg1: RawOrgProps = {
            id: "104",
            orgId: orgA.id,
        }
        const subOrg2: RawOrgProps = {
            id: "1004",
            orgId: orgA.id,
        }
        const subOrg3: RawOrgProps = {
            id: "105",
            orgId: orgB.id,
        }
        const subOrg4: RawOrgProps = {
            id: "1005",
            orgId: orgB.id,
        }
        const subOrg5: RawOrgProps = {
            id: "106",
            orgId: orgC.id,
        }
        const subOrg6: RawOrgProps = {
            id: "1006",
            orgId: orgC.id,
        }

        expect(
            getSubOrgs([orgA, orgB, orgC]).sort(compareOrg)
        ).toEqual(
            [subOrg1, subOrg2, subOrg3, subOrg4, subOrg5, subOrg6].sort(compareOrg)
        )
    })

    test("Finds no different", () => {
        const orgA: Organisation = {
            ...organisationA,
            subOrgIds: new Set(["4", "104", "1004"])
        }
        const orgB: Organisation = {
            ...organisationB,
            subOrgIds: new Set(["104", "4", "1004"])
        }
        const orgC: Organisation = {
            ...organisationC,
            subOrgIds: new Set(["1004", "104", "4"])
        }

        expect(getSubOrgs([orgA, orgB, orgC])).toEqual([])
    })

    test("Handles empty subOrgs", () => {
        expect(getSubOrgs([organisationA])).toEqual([])
    })
})
