import { Button, styled, Tooltip, TooltipProps, tooltipClasses } from "@mui/material";
import React, { useContext, useState } from 'react';
import { LayoutConfigureContext } from "../context/LayoutConfigureContext";
import topics from "../data/informs/topics.json";
import { getConstitutesByTopic } from "../service/Api";

// Layout Tooltip
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        maxWidth: 300,
        fontWeight: 400
    },
}));

const longText = `
  Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
  Praesent non nunc mollis, fermentum neque at, semper arcu.
  Nullam eget est sed sem iaculis gravida eget vitae justo.
  `;

interface ShowFilterProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShowFilter({ setIsOpen }: ShowFilterProps) {

    const [subtopics, setSubtopics] = useState<any>([]);
    const [subsubtopics, setSubSubtopics] = useState<any>([]);
    const [showTopicsHierarchy, setShowTopicsHierarchy] = useState<number>(0);
    const {
        setIsLoading,
        setFilter
    } = useContext(LayoutConfigureContext);

    function showSubtopic(topic: any) {
        setSubtopics(topic['topics']);
        setShowTopicsHierarchy(1);
    }

    // Aplicar filtro por tópico
    function applyFilterByTopic(topic: string) {
        // Realiza uma busca pelos continentes e range de promulgação
        setIsLoading(true);
        getConstitutesByTopic(topic)
            .then((data: any) => {
                // Adiciona todas as constituições aos nodes
                let nodes: string[] = data.map((elem: any) => elem.id);
                setFilter({ nodes });
            })
            .catch((err: any) => {
                console.log(err);
                setIsOpen(true);
            })
            .finally(() => {
                setIsLoading(false);
                setShowTopicsHierarchy(0);
            });
    }

    function showSubsubtopic(subtopic: any) {
        if (subtopic['topics'] != undefined) {
            setSubSubtopics(subtopic['topics']);
            setShowTopicsHierarchy(2);
        } else {
            applyFilterByTopic(subtopic['key']);
        }
    }

    function render() {
        if (showTopicsHierarchy == 0) {
            return (<>{
                topics.map((topic: any) => {
                    return (
                        <Button
                            variant="outlined"
                            key={topic['label']}
                            onClick={() => showSubtopic(topic)}
                            sx={{
                                fontSize: "8px",
                                fontWeight: "600",
                                width: "6rem",
                                height: "2.5rem",
                                lineHeight: "8px"
                            }}>
                            {topic['label']}
                        </Button>
                    )
                })
            }</>)
        } else if (showTopicsHierarchy == 1) {
            return (<>{
                subtopics.map((subtopic: any) => {
                    return (
                        <LightTooltip
                            title={subtopic['description']}
                            placement="top"
                            key={subtopic['label']}
                            enterDelay={2000}>
                            <Button
                                variant="outlined"
                                onClick={() => showSubsubtopic(subtopic)}
                                sx={{
                                    fontSize: "8px",
                                    fontWeight: "600",
                                    width: "6rem",
                                    height: "2.5rem",
                                    lineHeight: "8px"
                                }}>
                                {subtopic['label']}
                            </Button>
                        </LightTooltip>
                    )
                })
            }</>)
        } else {
            return (<>{
                subsubtopics.map((subsubtopic: any) => {
                    return (
                        <LightTooltip
                            title={subsubtopic['description']}
                            placement="top"
                            key={subsubtopic['label']}
                            enterDelay={2000}>
                            <Button
                                variant="outlined"
                                onClick={() => applyFilterByTopic(subsubtopic['key'])}
                                sx={{
                                    fontSize: "8px",
                                    fontWeight: "600",
                                    width: "6rem",
                                    height: "2.5rem",
                                    lineHeight: "8px"
                                }}>
                                {subsubtopic['label']}
                            </Button>
                        </LightTooltip>
                    )
                })
            }</>)
        }
    }

    return (
        <>{
            render()
        }</>
    )

}