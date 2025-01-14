"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/joy/styles";
import { Grid, Box } from "@mui/joy";
import ContentWrap from "@/components/ContentWrap/ContentWrap";
import NavList from "@/components/NavList/NavList";
import TopHeader from "@/components/TopHeader/TopHeader";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview/MarkdownPreview";
import { StyledGridItem } from "./LocalStorageStyles";

interface ListItem {
  text: string;
  content: string;
}

interface Template {
  content: string;
}

interface LocalStorageProps {
  defaultTemplate: string;
}

const LocalStorage: React.FC<LocalStorageProps> = ({ defaultTemplate }) => {
  const theme = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [markdown, setMarkdown] = useState<string[]>([]);

  const [editorContent, setEditorContent] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent ? savedContent : defaultTemplate;
  });

  const [activeTemplates, setActiveTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem("activeTemplates");
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown([...markdown, newMarkdown]);
  };

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    localStorage.setItem("editorContent", newContent);
  };

  const updateActiveTemplates = (newTemplates: ListItem[]) => {
    setActiveTemplates(newTemplates);
    localStorage.setItem("activeTemplates", JSON.stringify(newTemplates));
  };

  const handleButtonClick = (content: string) => {
    setEditorContent((prevContent) => prevContent + "\n\n" + content);
  };

  useEffect(() => {
    localStorage.setItem("editorContent", editorContent);
    localStorage.setItem("activeTemplates", JSON.stringify(activeTemplates));
  }, [editorContent, activeTemplates]);

  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches[0].clientY < 10) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventPullToRefresh, {
      passive: false,
    });
    return () => {
      document.removeEventListener("touchstart", preventPullToRefresh);
    };
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TopHeader editorContent={editorContent} />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          height: "calc(100vh - 64px)",
        }}
      >
        <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ height: "100%" }}>
          <StyledGridItem
            xs={12}
            md={4}
            lg={2}
            sx={{
              height: {
                xs: "min-content",
                md: "100%",
              },
              maxHeight: {
                xs: "200px",
                md: "none",
              },
              mb: { xs: 1, md: 0 },
              overflow: "auto",
            }}
          >
            <ContentWrap>
              <NavList handleClick={handleButtonClick} />
            </ContentWrap>
          </StyledGridItem>

          <Grid
            xs={12}
            md={8}
            lg={10}
            sx={{
              height: {
                xs: "calc(100% - 48px)",
                md: "100%",
              },
              overflow: "hidden",
            }}
          >
            <Box
              sx={(theme) => ({
                display: "flex",
                height: "100%",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", md: "row" },
                overflow: "hidden",
              })}
            >
              <Box
                sx={{
                  flexBasis: "50%",
                  height: { xs: "50%", md: "100%" },
                  minHeight: { xs: "300px", md: "auto" },
                }}
              >
                <ContentWrap>
                  <MarkdownEditor
                    onChange={setEditorContent}
                    content={editorContent}
                  />
                </ContentWrap>
              </Box>

              <Box
                sx={{
                  flexBasis: "50%",
                  height: { xs: "50%", md: "100%" },
                  minHeight: { xs: "300px", md: "auto" },
                }}
              >
                <ContentWrap>
                  <MarkdownPreview markdown={editorContent} />
                </ContentWrap>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LocalStorage;
