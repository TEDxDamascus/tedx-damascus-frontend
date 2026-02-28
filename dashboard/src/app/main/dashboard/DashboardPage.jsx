import { Paper, Grid, Box, Typography } from "@mui/material";
import { People, Event, CheckCircle, TrendingUp, Delete } from "@mui/icons-material";
import { useDialog } from "../../shared-components/Dialog/DialogProvider";
import { Button } from "@mui/material";
import { Save } from "@mui/icons-material";

const statsCards = [
  {
    title: "Total Speakers",
    value: "5",
    icon: <People sx={{ fontSize: 40 }} />,
    color: "#EB0028",
  },
  {
    title: "Upcoming Events",
    value: "2",
    icon: <Event sx={{ fontSize: 40 }} />,
    color: "#2196F3",
  },
  {
    title: "Completed Talks",
    value: "12",
    icon: <CheckCircle sx={{ fontSize: 40 }} />,
    color: "#4CAF50",
  },
  {
    title: "Total Attendees",
    value: "450",
    icon: <TrendingUp sx={{ fontSize: 40 }} />,
    color: "#FF9800",
  },
];

function DashboardPage() {
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
      >
        Welcome to TEDx Damascus Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 1 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: card.color }}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ color: card.color, opacity: 0.3 }}>{card.icon}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              minHeight: 300,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Activity feed will be displayed here...
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              minHeight: 300,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quick action buttons will be displayed here...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
